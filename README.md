# use-sync

A powerful React hook for intelligent state synchronization with Redux, featuring advanced caching, window event triggers, and smart request handling.

## 🚀 Quick Start

```bash
npm install @sirajju/use-sync
```

## 📖 Basic Example

```typescript
import { useSync } from "@sirajju/use-sync";

function App() {
  const endpoints = new Map([["users", "https://api.example.com/users"]]);

  const fetchOrders = [
    {
      key: "users",
      action: setUsers,
      priority: 1, // Higher priority items fetch first
      includedPaths: ['/dashboard', '/admin'], // Only sync on these paths
      transformResponse: async (response) => {
        const data = await response.json();
        return data.items; // Transform response before dispatch
      },
      refetchOnFocus: true,
      refetchOnline: true,
      initialSync: true, // Control initial fetch
      backgroundSync: false, // Control background syncing
      triggerEvents: ["scroll", "resize"], // Window events only
      options: {
        path: "/active", // Append to base URL
        params: { limit: 10 }, // Query parameters
        headers: { "Content-Type": "application/json" },
      },
    },
  ];

  const { isPending, haveError, loadingItems, refresh, clearCache } = useSync({
    fetchItems: endpoints,
    fetchOrder: fetchOrders,
    logger: true,
    logLevel: "DEBUG",
    cacheDuration: 5000,
  });

  return isPending ? <Loading /> : <UserList />;
}
```

## 🎯 Key Features

### 1. Intelligent Caching
```typescript
const { clearCache } = useSync({
  fetchItems: endpoints,
  fetchOrder: orders,
  cacheDuration: 5000 // Cache duration in milliseconds
});

// Clear specific or all cache
clearCache("users"); // Clear specific endpoint
clearCache(); // Clear all cache
```

### 2. Smart Request Handling
```typescript
const order = {
  key: "users",
  backgroundSync: true, // Non-blocking sync
  initialSync: false, // Skip initial fetch
  refetchOnFocus: true, // Refetch when window focused
  refetchOnline: true // Refetch when back online
};
```

### 3. Path-Based Syncing
```typescript
const order = {
  key: "admin-data",
  includedPaths: ['/admin', '/dashboard'], // Only sync on these paths
  priority: 2 // Higher priority = earlier fetch
};
```

### 4. Advanced Logging
```typescript
const config = {
  log: true, // Enable logging
  logLevel: "DEBUG", // DEBUG | INFO | WARN | ERROR
  logger: (level, message) => {
    customLogger.log(level, message); // Optional custom logger
  }
};
```

### 5. Response Transformation
```typescript
const order = {
  transformResponse: async (response) => {
    const data = await response.json();
    return data.items; // Transform before dispatch
  }
};
```

## 📚 API Reference

### Types
```typescript
interface order {
  key: string;                                           // Unique identifier for the request
  action: (data: any) => any;                           // Redux action to dispatch
  priority?: number;                                     // Higher number = higher priority
  includedPaths?: string[];                             // Paths where sync is allowed
  transformResponse?: (response: Response) => Promise<any>; // Transform response before dispatch
  refetchOnFocus?: boolean;                             // Refetch when window gains focus
  refetchOnline?: boolean;                              // Refetch when connection restored
  initialSync?: boolean;                                // Whether to sync on mount
  backgroundSync?: boolean;                             // Non-blocking background sync
  triggerEvents?: (keyof WindowEventMap)[];             // Window events that trigger sync
  options?: {
    path?: string;                                      // Append to base URL
    params?: Record<string, any>;                       // URL query parameters
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: HeadersInit;
    body?: any;
  };
}

interface fetchOptions {
  path?: string;
  params?: Record<string, any>;
  method?: string;
  headers?: HeadersInit;
  body?: any;
}
```

### useSync Hook
```typescript
interface useSyncProps {
  fetchItems: Map<string, string>;
  fetchOrder: order[];
  throwError?: boolean;
  onError?: (error: any) => void;
  log?: boolean;
  logger?: (level: "DEBUG" | "INFO" | "WARN" | "ERROR", message: string) => void;
  cacheDuration?: number;
  logLevel?: "DEBUG" | "INFO" | "WARN" | "ERROR";
}
```

### syncIndividual Function
```typescript
function syncIndividual(
  name: string, 
  options?: fetchOptions,
  customAction?: (data: any) => any,
  dispatch?: (action: any) => void
): Promise<any>;
```

## 📦 Requirements

- React 16.8+
- Redux
- React Redux

## 📄 License

This project is licensed under the GNU General Public License v2.0 - see the [LICENSE](LICENSE.txt) file for details.
