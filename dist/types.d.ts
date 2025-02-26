export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export declare const LogColors: {
    readonly DEBUG: "color: #5bc0de";
    readonly INFO: "color: #28a745";
    readonly WARN: "color: #ffc107";
    readonly ERROR: "color: #dc3545";
    readonly DEFAULT: "";
};
export declare const LogLevels: {
    readonly DEBUG: "debug";
    readonly INFO: "info";
    readonly WARN: "warn";
    readonly ERROR: "error";
};
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
    logger?: (level: keyof typeof LogLevel, message: string) => void;
    cacheDuration?: number;
    logLevel?: keyof typeof LogLevel;
    waiting?: boolean;
    customFetch?: (url: string, options: any) => Promise<any>;
    reSyncOnPathChange?: boolean;
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
    triggerEvents?: (keyof WindowEventMap)[];
    options?: fetchOptions;
    priority?: number;
    allowDuplicates?: boolean;
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
}
