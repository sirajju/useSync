import { fetchOptions, useSyncProps, RecentRequest } from "./types";
declare const clearCache: (key?: string) => Promise<void>;
declare const getHistory: (clean?: boolean) => RecentRequest[];
declare const syncIndividual: (name: string, fetchOptions?: fetchOptions, customAction?: boolean | null | ((data: any) => any), dispatch?: (action: any) => void) => Promise<any>;
declare const useSync: ({ fetchOrder, fetchItems, throwError, cacheDuration, logLevel, ...rest }: useSyncProps) => {
    isPending: boolean;
    haveError: boolean;
    clearCache: (key?: string) => Promise<void>;
    refresh: () => Promise<(() => void) | undefined>;
    loadingItems: string[];
};
export { useSync, syncIndividual, clearCache, getHistory };
