export declare const storeInIndexedDB: (key: string, data: any, expiresAt: number) => Promise<void>;
export declare const getFromIndexedDB: (key: string) => Promise<{
    data: any;
    timestamp: number;
    expiresAt: number;
} | null>;
export declare const deleteFromIndexedDB: (key: string) => Promise<void>;
export declare const clearIndexedDBCache: () => Promise<void>;
