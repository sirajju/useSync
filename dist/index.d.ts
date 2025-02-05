import { order, fetchOptions } from "./types";
declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
interface useSyncProps {
    fetchItems: Map<string, string>;
    fetchOrder: order[];
    throwError?: boolean;
    onError?: (error: any) => void;
    log?: boolean;
    logger?: (level: keyof typeof LogLevel, message: string) => void;
    cacheDuration?: number;
    logLevel?: keyof typeof LogLevel;
    waiting?: boolean;
}
declare const clearCache: (key?: string) => void;
declare const useSync: ({ fetchOrder, fetchItems, throwError, cacheDuration, logLevel, ...rest }: useSyncProps) => {
    isPending: boolean;
    haveError: boolean;
    clearCache: (key?: string) => void;
    refresh: () => Promise<(() => void) | undefined>;
    loadingItems: string[];
};
declare const syncIndividual: (name: string, fetchOptions?: fetchOptions, customAction?: null | ((data: any) => any), dispatch?: (action: any) => void) => Promise<any>;
export { useSync, syncIndividual, clearCache };
