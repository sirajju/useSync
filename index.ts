import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { order, fetchOptions } from "./types";

let orders: order[] = [];
let items: Map<string, string> = new Map();

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface useSyncProps {
  fetchItems: Map<string, string>;
  fetchOrder: order[];
  throwError?: boolean;
  onError?: (error: any) => void;
  log?: boolean;
  logger?: (message: any) => void;
  cacheDuration?: number;
  logLevel?: keyof typeof LogLevel;
}
let options: useSyncProps;

const throwErrorNow = (message: string) => {
  if (options && options.throwError) throw new Error(message);
  else console.error(message);
};

const LogColors = {
  DEBUG: "color: #5bc0de", // Light blue
  INFO: "color: #28a745", // Green
  WARN: "color: #ffc107", // Yellow
  ERROR: "color: #dc3545", // Red
  DEFAULT: "",
} as const;

const LogLevels = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;

const isLogLevelEnabled = (messageLevel: keyof typeof LogLevels) => {
  if (!options?.logLevel) return true; // If no level specified, show all logs
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

  if (options.logger) return options.logger(message);
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

let myDispatch: any;

// Add cache interfaces
interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

interface RequestTracker {
  timestamp: number;
  promise: Promise<any>;
}

// Add cache and request tracking
const cache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, RequestTracker>();
const backgroundSyncs = new Map<string, () => void>();
let CACHE_DURATION = 5 * 1000; // 5 seconds (only used to reduce server requests within short span)

const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
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

const useSync = ({
  fetchOrder,
  fetchItems,
  throwError = true,
  cacheDuration,
  logLevel = "DEBUG", // Add default log level
  ...rest
}: useSyncProps) => {
  const isFirstRender = useRef(true);
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
  }, [loadingItems]);

  // Use ref for pending items to avoid re-renders
  const pendingItemsRef = useRef<string[]>([]);
  const dispatch = useDispatch();
  myDispatch = dispatch;

  const handleSync = useCallback(
    async (key: string, options: fetchOptions = {}) => {
      await syncIndividual(key, options, dispatch);
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
          const requestUrl = requestParaams
            ? ObjectIntoUrlParameters(url, requestParaams)
            : url;
          const response = await fetch(requestUrl, config.options || {});
          if (!response.ok) {
            logger(`Request failed for ${config.key}`, "ERROR", {
              status: response.status,
            });
            throw new Error(`Failed to fetch ${config.key}`);
          }

          const data = await response.json();

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
    if (!mountedRef.current) return;

    try {
      setSyncState({ isPending: true, haveError: false });
      logger("Starting sync process", "INFO");

      const refetchOnline: string[] = [];
      const refetchOnFocus: string[] = [];
      const triggerEvents: { key: string; events: string[] }[] = [];

      const currentFetchOrder = configRef.current.fetchOrder;
      const currentFetchItems = configRef.current.fetchItems;

      // Collect all event triggers first
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

      // Setup event listeners
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

      // Setup window event listeners
      const eventHandlers = new Map<string, () => void>();
      triggerEvents.forEach(({ key, events }) => {
        events.forEach((event) => {
          const handler = () => {
            logger(`Window event "${event}" triggered for ${key}`, "DEBUG");
            handleSync(key);
          };
          eventHandlers.set(`${key}-${event}`, handler);
          // Only add window events
          if (typeof window !== "undefined") {
            window.addEventListener(event, handler);
          }
        });
      });

      // Execute fetches
      const promises = currentFetchOrder
        .map(async (config) => {
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

          if (pendingItemsRef.current.includes(config.key)) {
            logger(`Skipping ${config.key} - already pending`, "WARN");
            return;
          }

          const url = currentFetchItems.get(config.key);
          if (!url) {
            logger(`URL not found for ${config.key}`, "ERROR");
            return throwErrorNow(`url not found for ${config.key}`);
          }

          pendingItemsRef.current = [...pendingItemsRef.current, config.key];

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
          } finally {
            if (mountedRef.current) {
              pendingItemsRef.current = pendingItemsRef.current.filter(
                (item) => item !== config.key
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

      // Return cleanup function for event listeners
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
      logger("Sync process failed", "ERROR", { error });
      if (configRef.current.onError) configRef.current.onError(error);
    } finally {
    }
  }, [dispatch, fetchWithCache, handleSync]);

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

let isFetchPendingForSameItem: string[] = [];

// Update syncIndividual to use cache
const syncIndividual = async (
  name: string,
  options: fetchOptions = {},
  dispatch: (action: any) => void = myDispatch
) => {
  const cacheKey = `individual-${name}`;

  if (pendingRequests.get(cacheKey)) {
    logger(`Request already pending for ${name}`, "DEBUG");
    return;
  }

  if (isFetchPendingForSameItem.includes(name)) {
    logger(`Skipping duplicate fetch for ${name}`, "DEBUG");
    return;
  }

  logger(`Starting individual sync for ${name}`, "INFO");
  isFetchPendingForSameItem.push(name);

  try {
    const config = orders.find((item) => item.key === name);
    const url = items.get(name);
    if (!url || !config) {
      logger(`Configuration not found for ${name}`, "ERROR");
      return throwErrorNow(`no url found for item ${name}`);
    }

    const requestOptions = { ...config.options, ...options };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      logger(`Individual sync failed for ${name}`, "ERROR", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`Failed to fetch ${name} ${response.statusText}`);
    }

    const data = await response.json();
    logger(`Individual sync successful for ${name}`, "INFO", {
      dataSize: JSON.stringify(data).length,
    });
    dispatch(config.action(data));
    return data;
  } catch (error) {
    logger(`Individual sync error : ${error}`, "ERROR");
  } finally {
    isFetchPendingForSameItem = isFetchPendingForSameItem.filter(
      (el) => el !== name
    );
    logger(`Completed individual sync for ${name}`, "DEBUG");
  }
};

export { useSync, syncIndividual, clearCache };
