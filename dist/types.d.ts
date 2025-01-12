export type order = {
    name: string;
    action: (arg: any) => any;
    refetchOnFocus?: boolean;
    refetchOnline?: boolean;
    options?: {
        method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
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
    };
};
//# sourceMappingURL=types.d.ts.map