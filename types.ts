export type order = {
  key: string;
  action: (arg: any) => any;
  transformResponse?: (response: any) => any;
  refetchOnFocus?: boolean;
  refetchOnline?: boolean;
  initialSync?: boolean;
  backgroundSync?: boolean;
  triggerEvents?: (keyof WindowEventMap)[]; // Only window event names like 'scroll', 'resize'
  options?: fetchOptions;
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
