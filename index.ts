import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  order,
  fetchOptions,
  LogLevel,
  LogColors,
  LogLevels,
  useSyncProps,
  CacheEntry,
  RequestTracker,
  RecentRequest,
} from "./types";

// Global state
let orders: order[] = [];
let items: Map<string, string> = new Map();
let options: useSyncProps;
let myDispatch: any;
let isInitialSyncCompleted = false;
let isFetchPendingForSameItem: string[] = [];
let CACHE_DURATION = 5 * 1000;

// Global storage
const cache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, RequestTracker>();
const backgroundSyncs = new Map<string, () => void>();
let recentRequests: RecentRequest[] = [];

// Helper functions
const throwErrorNow = (message: string) => {
  if (options?.throwError) throw new Error(message);
  else console.error(message);
};

const isLogLevelEnabled = (messageLevel: keyof typeof LogLevels) => {
  if (!options?.logLevel) return true;
  const configuredLevel = LogLevel[options.logLevel];
  const currentLevel = LogLevel[messageLevel];
  return currentLevel >= configuredLevel;
};

const logger = (
  message: string,
  level: keyof typeof LogLevels = "INFO",
  details?: any
) => {
  if (!options?.log || !isLogLevelEnabled(level)) return;

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] %c${level.toUpperCase()}%c: ${message}`;

  if (options.logger) return options.logger(level, message);
  if (details) {
    (console[level.toLowerCase() as keyof Console] as Function)(
      logMessage,
      LogColors[level as keyof typeof LogColors],
      LogColors.DEFAULT,
      details
    );
  } else {
    (console[level.toLowerCase() as keyof Console] as Function)(
      logMessage,
      LogColors[level as keyof typeof LogColors],
      LogColors.DEFAULT
    );
  }
};

const ObjectIntoUrlParameters = (url: string, object: Record<string, any>) => {
  if (!object || Object.keys(object).length === 0) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(object)) {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }

  const queryString = params.toString();
  if (!queryString) return url;

  return `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
};

const updateRecentRequestData = (options: any, response: any) => {
  const index = recentRequests.findIndex(
    (item) => item.url === options.url && item.timestamp === options.timestamp
  );

  if (index !== -1) {
    recentRequests[index] = {
      ...recentRequests[index],
      recieveTime: Date.now(),
      response: response,
    };
  }
};

const waitForCompletingInitialSync = async () => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (isInitialSyncCompleted) {
        clearInterval(interval);
        resolve(true);
      }
    }, 100);
  });
};

// Main functions
const clearCache = (key?: string) => {
  if (key) cache.delete(key);
  else cache.clear();
};

const cleanOldRequests = (maxAge: number = 1000 * 60 * 5) => {
  // 5 minutes default
  const now = Date.now();
  recentRequests = recentRequests.filter((req) => now - req.timestamp < maxAge);
};

const getHistory = (clean: boolean = true) => {
  if (clean) {
    cleanOldRequests();
  }
  return recentRequests;
};

const syncIndividual = async (
  name: string,
  fetchOptions: fetchOptions = {},
  customAction?: boolean | null | ((data: any) => any),
  dispatch: (action: any) => void = myDispatch
) => {
  if (!isInitialSyncCompleted && options.waiting) {
    logger(`${name} Waiting for initial sync to complete`, "DEBUG");
    await waitForCompletingInitialSync();
  }

  const config = orders.find((item) => item.key === name);
  const url = items.get(name);
  if (!url || !config) {
    logger(`Configuration not found for ${name}`, "ERROR");
    return throwErrorNow(`no url found for item ${name}`);
  }
  if (!config.allowDuplicates) {
    if (isFetchPendingForSameItem.includes(`${name}_${fetchOptions.path}`)) {
      logger(`Skipping duplicate fetch for ${name}`, "DEBUG");
      return;
    }

    logger(`Starting individual sync for ${name}`, "INFO");
    isFetchPendingForSameItem.push(`${name}_${fetchOptions.path}`);
  }

  try {
    const requestOptions = { ...config.options, ...fetchOptions };

    const requestUrlWithPath = requestOptions.path
      ? `${url}${requestOptions.path}`
      : url;

    const requestUrl = requestOptions.params
      ? ObjectIntoUrlParameters(requestUrlWithPath, requestOptions.params)
      : requestUrlWithPath;

    const requestData = {
      url: requestUrl,
      timestamp: Date.now(),
      params: requestOptions.params || {},
      headers: requestOptions.headers || {},
      options: requestOptions,
      path: requestOptions.path || "",
      response: undefined,
      recieveTime: undefined,
    };

    recentRequests.push(requestData);

    const response = await fetch(requestUrl, requestOptions);

    if (!response.ok) {
      const haveJsonResponse = response.headers
        .get("content-type")
        ?.includes("application/json");
      if (haveJsonResponse) {
        try {
          const errorData = await response.json();
          logger(`Sync failed for ${name}`, "ERROR", {
            status: response.status,
            statusText: response.statusText,
            errorData,
          });
          throw new Error(
            `Failed to fetch ${name} ${response.statusText} - ${errorData.message}`
          );
        } catch (error) {}
      }
      logger(`Sync failed for ${name}`, "ERROR", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`Failed to fetch ${name} ${response.statusText}`);
    }
    let data = null;
    if (!config.transformResponse) data = await response.json();
    else data = await config.transformResponse(response);

    updateRecentRequestData(requestData, data);

    logger(`Individual sync successful for ${name}`, "INFO", {
      dataSize: JSON.stringify(data).length,
    });
    if (customAction !== false) {
      if (typeof customAction == "function") dispatch(customAction(data));
      else dispatch(config.action(data));
    }
    return data;
  } catch (error) {
    logger(`Sync error : ${error}`, "ERROR");
  } finally {
    isFetchPendingForSameItem = isFetchPendingForSameItem.filter(
      (el) => el !== `${name}_${fetchOptions.path}`
    );
    logger(`Completed individual sync for ${name}`, "DEBUG");
  }
};

const useSync = ({
  fetchOrder,
  fetchItems,
  throwError = true,
  cacheDuration,
  logLevel = "DEBUG", // Add default log level
  ...rest
}: useSyncProps) => {
  fetchOrder = fetchOrder.sort(
    (a: order, b: order) => b.priority! - a.priority!
  );

  const mountedRef = useRef(false);
  const configRef = useRef({
    fetchOrder,
    fetchItems,
    throwError,
    logLevel,
    ...rest,
  });

  CACHE_DURATION = cacheDuration || CACHE_DURATION;
  // Store these in ref to avoid dependency changes
  options = configRef.current;
  items = configRef.current.fetchItems;
  orders = configRef.current.fetchOrder;

  const [syncState, setSyncState] = useState({
    isPending: true, // Start with true since we're loading on mount
    haveError: false,
  });

  // Track loading state for individual items
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  // Update pending state based on loading items
  useEffect(() => {
    setSyncState((prev) => ({
      ...prev,
      isPending: loadingItems.size > 0,
    }));
    isInitialSyncCompleted = loadingItems.size == 0;
  }, [loadingItems]);

  // Use ref for pending items to avoid re-renders
  const pendingItemsRef = useRef<string[]>([]);
  const dispatch = useDispatch();
  myDispatch = dispatch;

  const handleSync = useCallback(
    async (key: string, options: fetchOptions = {}) => {
      await syncIndividual(key, options, null, dispatch);
    },
    [dispatch]
  );

  // Memoize fetchWithCache to prevent recreations
  const fetchWithCache = useCallback(async (config: order, url: string) => {
    setLoadingItems((prev) => new Set([...Array.from(prev), config.key]));

    try {
      const cacheKey = `${config.key}-${url}`;
      const now = Date.now();

      // Check cache first
      const cachedData = cache.get(cacheKey);
      if (cachedData && now < cachedData.expiresAt) {
        logger(`Using cached data for ${config.key}`, "DEBUG");
        return cachedData.data;
      }

      // Check for pending requests
      const pendingRequest = pendingRequests.get(cacheKey);
      if (pendingRequest && now - pendingRequest.timestamp < 5000) {
        logger(`Reusing pending request for ${config.key}`, "DEBUG");
        return pendingRequest.promise;
      }

      // Create new request
      const requestPromise = (async () => {
        try {
          logger(`Making fresh request for ${config.key}`, "DEBUG");
          const requestParaams = config.options?.params;
          const requestUrlWithPath = config.options?.path
            ? `${url}${config.options?.path}`
            : url;
          const requestUrl = requestParaams
            ? ObjectIntoUrlParameters(requestUrlWithPath, requestParaams)
            : requestUrlWithPath;

          const requestData = {
            url: requestUrl || url,
            timestamp: Date.now(),
            params: requestParaams || {},
            headers: config.options?.headers || {},
            options: config.options || {},
            path: config.options?.path || "",
            response: undefined,
            recieveTime: undefined,
          };

          recentRequests.push(requestData);
          const response = options.customFetch
            ? await options.customFetch(requestUrl, config.options || {})
            : await fetch(requestUrl, config.options || {});

          let data = null;

          if (!config.transformResponse) data = await response.json();
          else data = await config.transformResponse(response);

          updateRecentRequestData(requestData, data);

          if (!response.ok) {
            try {
              logger(
                data.message || `Request failed for ${config.key}`,
                "ERROR",
                {
                  status: response.status,
                  statusText: response.statusText,
                }
              );
              updateRecentRequestData(requestData, data);
              throwErrorNow(data.message || response);
            } catch (error) {
              throwErrorNow(data.message || response);
            }
          }

          // Cache the successful response
          cache.set(cacheKey, {
            data,
            timestamp: now,
            expiresAt: now + CACHE_DURATION,
          });

          logger(`Cached new data for ${config.key}`, "DEBUG", {
            expiresAt: new Date(now + CACHE_DURATION),
          });
          return data;
        } finally {
          pendingRequests.delete(cacheKey);
        }
      })();

      // Track the pending request
      pendingRequests.set(cacheKey, {
        timestamp: now,
        promise: requestPromise,
      });

      return requestPromise;
    } finally {
    }
  }, []);

  const syncData = useCallback(async () => {
    isInitialSyncCompleted = false;
    if (!mountedRef.current) return;

    try {
      setSyncState({ isPending: true, haveError: false });
      logger("Starting sync process", "INFO");

      const refetchOnline: string[] = [];
      const refetchOnFocus: string[] = [];
      const triggerEvents: { key: string; events: string[] }[] = [];

      const currentFetchOrder = configRef.current.fetchOrder;
      const currentFetchItems = configRef.current.fetchItems;

      currentFetchOrder.forEach((config) => {
        if (config.refetchOnline) refetchOnline.push(config.key);
        if (config.refetchOnFocus) refetchOnFocus.push(config.key);
        if (config.triggerEvents) {
          triggerEvents.push({
            events:
              typeof config.triggerEvents === "string"
                ? [config.triggerEvents]
                : config.triggerEvents,
            key: config.key,
          });
        }
      });

      const onlineHandler = () => {
        logger("Online event triggered", "DEBUG");
        refetchOnline.forEach((key) => handleSync(key));
      };

      const focusHandler = () => {
        logger("Focus event triggered", "DEBUG");
        refetchOnFocus.forEach((key) => handleSync(key));
      };

      window.addEventListener("online", onlineHandler);
      window.addEventListener("focus", focusHandler);

      const eventHandlers = new Map<string, () => void>();
      triggerEvents.forEach(({ key, events }) => {
        events.forEach((event) => {
          const handler = () => {
            logger(`Window event "${event}" triggered for ${key}`, "DEBUG");
            handleSync(key);
          };
          eventHandlers.set(`${key}-${event}`, handler);
          if (typeof window !== "undefined") {
            window.addEventListener(event, handler);
          }
        });
      });

      const promises = currentFetchOrder
        .map(async (config) => {
          const url = currentFetchItems.get(config.key);
          if (
            typeof config.includedPaths === "object" &&
            Array.isArray(config.includedPaths)
          ) {
            const currentPath = options.getPathName
              ? options.getPathName(url!)
              : window.location.pathname;
            if (!config.includedPaths.includes(currentPath)) {
              logger(`Skipping ${config.key} - not in included paths`, "WARN");
              return;
            }
          }
          if (
            typeof config.excludedPaths === "object" &&
            Array.isArray(config.excludedPaths)
          ) {
            const currentPath = options.getPathName
              ? options.getPathName(url!)
              : window.location.pathname;
            if (config.excludedPaths.includes(currentPath)) {
              logger(`Skipping ${config.key} - in excluded paths`, "WARN");
              return;
            }
          }
          if (typeof config.initialSync == "boolean" && !config.initialSync)
            return;
          if (
            typeof config.backgroundSync == "boolean" &&
            config.backgroundSync
          ) {
            setLoadingItems((prev) => {
              const next = new Set(prev);
              next.delete(config.key);
              return next;
            });
            return backgroundSyncs.set(config.key, () =>
              handleSync(config.key)
            );
          }

          if (
            pendingItemsRef.current.includes(
              `${config.key}_${config.options?.path}`
            )
          ) {
            logger(`Skipping ${config.key} - already pending`, "WARN");
            return;
          }

          if (!url) {
            logger(`URL not found for ${config.key}`, "ERROR");
            return throwErrorNow(`url not found for ${config.key}`);
          }

          pendingItemsRef.current = [
            ...pendingItemsRef.current,
            `${config.key}_${config.options?.path}`,
          ];

          try {
            const data = await fetchWithCache(config, url);

            setLoadingItems((prev) => {
              const next = new Set(prev);
              next.delete(config.key);
              return next;
            });

            if (mountedRef.current) {
              dispatch(config.action(data));
            }
          } catch (error) {
            logger(`Sync error : ${error}`, "ERROR");
          } finally {
            if (mountedRef.current) {
              pendingItemsRef.current = pendingItemsRef.current.filter(
                (item) => item !== `${config.key}_${config.options?.path}`
              );
            }
          }
        })
        .filter(Boolean);

      await Promise.all(promises);

      if (mountedRef.current) {
        setSyncState({ isPending: false, haveError: false });
        const backgroundSyncEntries = Array.from(backgroundSyncs.entries());
        for (const [key, callback] of backgroundSyncEntries) {
          callback();
          backgroundSyncs.delete(key);
        }
      }

      return () => {
        logger("Cleaning up event listeners", "DEBUG");
        window.removeEventListener("online", onlineHandler);
        window.removeEventListener("focus", focusHandler);

        triggerEvents.forEach(({ key, events }) => {
          events.forEach((event) => {
            const handler = eventHandlers.get(`${key}-${event}`);
            if (handler && typeof window !== "undefined") {
              window.removeEventListener(event, handler);
            }
          });
        });
        eventHandlers.clear();
      };
    } catch (error) {
      setSyncState((prev) => ({ ...prev, haveError: true }));

      isInitialSyncCompleted = true;
      logger("Sync process failed", "ERROR", { error });
      if (configRef.current.onError) configRef.current.onError(error);
    } finally {
    }
  }, [dispatch, fetchWithCache, handleSync]);

  const [location, setLocation] = useState(window.location.pathname);

  useEffect(() => {
    if (!configRef.current.reSyncOnPathChange) return;
    const handleLocationChange = () => {
      const newPath = window.location.pathname;
      if (newPath !== location) {
        setLocation(newPath);
        logger("Location changed, triggering re-sync", "INFO");
        syncData();
      }
    };

    window.addEventListener("popstate", handleLocationChange);

    // For handling programmatic navigation (e.g., using react-router)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function () {
      originalPushState.apply(this, [...arguments] as [
        any,
        string,
        string | URL | null | undefined
      ]);
      handleLocationChange();
    };

    window.history.replaceState = function () {
      originalReplaceState.apply(this, [...arguments] as [
        any,
        string,
        string | URL | null | undefined
      ]);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [location, syncData]);

  useEffect(() => {
    mountedRef.current = true;
    const cleanup = syncData();

    return () => {
      mountedRef.current = false;
      cleanup.then((cb) => cb && cb());
    };
  }, [syncData]);

  return {
    isPending: syncState.isPending || loadingItems.size > 0,
    haveError: syncState.haveError,
    clearCache,
    refresh: syncData,
    loadingItems: Array.from(loadingItems),
  };
};

export { useSync, syncIndividual, clearCache, getHistory };
