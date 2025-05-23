import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";

// Assume types like order, fetchOptions, etc., are now just JS objects without TypeScript types.

let orders = [];
let items = new Map();
let options;
let myDispatch;
let isInitialSyncCompleted = false;
let isFetchPendingForSameItem = [];
let CACHE_DURATION = 5 * 1000;

const cache = new Map();
const pendingRequests = new Map();
const backgroundSyncs = new Map();
let recentRequests = [];

const throwErrorNow = (message) => {
  if (options?.throwError) throw new Error(message);
  else console.error(message);
};

const isLogLevelEnabled = (messageLevel) => {
  if (!options?.logLevel) return true;
  const configuredLevel = LogLevel[options.logLevel];
  const currentLevel = LogLevel[messageLevel];
  return currentLevel >= configuredLevel;
};

const logger = (message, level = "INFO", details) => {
  if (!options?.log || !isLogLevelEnabled(level)) return;
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] %c${level.toUpperCase()}%c: ${message}`;
  if (options.logger) return options.logger(level, message, details);
  if (details) {
    console[level.toLowerCase()](logMessage, LogColors[level], LogColors.DEFAULT, details);
  } else {
    console[level.toLowerCase()](logMessage, LogColors[level], LogColors.DEFAULT);
  }
};

const ObjectIntoUrlParameters = (url, object) => {
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

const updateRecentRequestData = (options, response) => {
  const index = recentRequests.findIndex(item => item.url === options.url && item.timestamp === options.timestamp);
  if (index !== -1) {
    recentRequests[index] = {
      ...recentRequests[index],
      recieveTime: Date.now(),
      response: response,
    };
  }
};

const waitForCompletingInitialSync = async () => {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (isInitialSyncCompleted) {
        clearInterval(interval);
        resolve(true);
      }
    }, 100);
  });
};

const clearCache = (key) => {
  if (key) cache.delete(key);
  else cache.clear();
};

const cleanOldRequests = (maxAge = 1000 * 60 * 5) => {
  const now = Date.now();
  recentRequests = recentRequests.filter(req => now - req.timestamp < maxAge);
};

const getHistory = (clean = true) => {
  if (clean) cleanOldRequests();
  return recentRequests;
};

const syncIndividual = async (name, fetchOptions = {}, customAction, dispatch = myDispatch) => {
  if (!isInitialSyncCompleted && options.waiting) {
    logger(`${name} Waiting for initial sync to complete`, "DEBUG");
    await waitForCompletingInitialSync();
  }
  const config = orders.find(item => item.key === name);
  const url = items.get(name);
  if (!url || !config) {
    logger(`Configuration not found for ${name}`, "ERROR");
    return throwErrorNow(`no url found for item ${name}`);
  }
  if (!config.allowDuplicates && isFetchPendingForSameItem.includes(`${name}_${fetchOptions.path}`)) {
    logger(`Skipping duplicate fetch for ${name}`, "DEBUG");
    return;
  }
  if (!config.allowDuplicates) {
    isFetchPendingForSameItem.push(`${name}_${fetchOptions.path}`);
  }
  try {
    const requestOptions = { ...config.options, ...fetchOptions };
    const requestUrlWithPath = requestOptions.path ? `${url}${requestOptions.path}` : url;
    const requestUrl = requestOptions.params ? ObjectIntoUrlParameters(requestUrlWithPath, requestOptions.params) : requestUrlWithPath;
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
      const haveJsonResponse = response.headers.get("content-type")?.includes("application/json");
      if (haveJsonResponse) {
        try {
          const errorData = await response.json();
          logger(`Sync failed for ${name}`, "ERROR", { status: response.status, statusText: response.statusText, errorData });
          throw new Error(`Failed to fetch ${name} ${response.statusText} - ${errorData.message}`);
        } catch (error) {}
      }
      logger(`Sync failed for ${name}`, "ERROR", { status: response.status, statusText: response.statusText });
      throw new Error(`Failed to fetch ${name} ${response.statusText}`);
    }
    let data = null;
    if (!config.transformResponse) data = await response.json();
    else data = await config.transformResponse(response);
    updateRecentRequestData(requestData, data);
    logger(`Individual sync successful for ${name}`, "INFO", { dataSize: JSON.stringify(data).length });
    if (customAction !== false) {
      if (typeof customAction == "function") dispatch(customAction(data));
      else dispatch(config.action(data));
    }
    return data;
  } catch (error) {
    logger(`Sync error : ${error}`, "ERROR");
  } finally {
    isFetchPendingForSameItem = isFetchPendingForSameItem.filter(el => el !== `${name}_${fetchOptions.path}`);
    logger(`Completed individual sync for ${name}`, "DEBUG");
  }
};