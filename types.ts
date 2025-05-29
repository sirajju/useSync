export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export const LogColors = {
  DEBUG: "color: #5bc0de",
  INFO: "color: #28a745",
  WARN: "color: #ffc107",
  ERROR: "color: #dc3545",
  DEFAULT: "",
} as const;

export const LogLevels = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;

export interface RecentRequest {
  url: string;
  timestamp: number;
  path: string;
  params: Record<string, any>;
  options: fetchOptions;
  recieveTime?: number;
  response?: any;
  headers: any;
}

export interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

export interface RequestTracker {
  timestamp: number;
  promise: Promise<any>;
}

export interface useSyncProps {
  fetchItems: Map<string, string>;
  fetchOrder: order[];
  throwError?: boolean;
  onError?: (error: any) => void;
  log?: boolean;
  logger?: (
    level: keyof typeof LogLevel,
    message: string,
    details?: any
  ) => void;
  cacheDuration?: number;
  logLevel?: keyof typeof LogLevel;
  waiting?: boolean;
  customFetch?: (url: string, options: any) => Promise<any>;
  getPathName?: (url: string) => string;
  reSyncOnPathChange?: boolean;
  generateCacheKey?: (name: string, url: string, params?: Record<string, any>) => string;
}

export type order = {
  key: string;
  action: (arg: any) => any;
  transformResponse?: (response: any) => any;
  refetchOnFocus?: boolean;
  refetchOnline?: boolean;
  initialSync?: boolean;
  backgroundSync?: boolean;
  includedPaths?: string[];
  excludedPaths?: string[];
  triggerEvents?: (keyof WindowEventMap)[];
  options?: fetchOptions;
  priority?: number;
  allowDuplicates?: boolean;
  indexDbCache?: boolean;
};

export interface fetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path?: string;
  params?: Record<string, any>;
  headers?: HeadersInit;
  body?: string | FormData | URLSearchParams;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal;
  indexDbCache?: boolean;
  updateIndexDbData?: boolean;
}
