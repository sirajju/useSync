export type order = {
  key: string;
  action: (arg: any) => any;
  refetchOnFocus?: boolean;
  refetchOnline?: boolean;
  triggerEvents?: (keyof WindowEventMap)[];  // Only window event names like 'scroll', 'resize'
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
