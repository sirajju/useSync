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

### 1. Sync Control

```typescript
const fetchOrders = [
  {
    key: "users",
    initialSync: false, // Skip initial fetch
    backgroundSync: true, // Fetch in background
    // ...other options
  },
];
```

### 2. URL Parameters

```typescript
const order = {
  options: {
    params: {
      limit: 10,
      offset: 0,
      sort: "desc",
    },
  },
};
// Results in: /api/users?limit=10&offset=0&sort=desc
```

### 3. Window Event Triggers

```typescript
const order = {
  triggerEvents: ["scroll", "resize", "visibilitychange"],
};
```

Available Window Events:

- `scroll` - Page scroll
- `resize` - Window resize
- `online`/`offline` - Network status
- `focus`/`blur` - Window focus
- `visibilitychange` - Tab visibility
- `storage` - LocalStorage changes
- `popstate` - History changes
- `load`/`beforeunload` - Page lifecycle

### 4. Priority and Path-based Syncing

```typescript
const fetchOrders = [
  {
    key: "critical-data",
    priority: 2, // Highest priority
    action: setCriticalData
  },
  {
    key: "user-preferences",
    priority: 1,
    includedPaths: ['/settings', '/profile'],
    action: setPreferences
  },
  {
    key: "analytics",
    priority: 0, // Lowest priority
    includedPaths: ['/dashboard'],
    action: setAnalytics
  }
];

// Items will sync in order: critical-data -> user-preferences -> analytics
// user-preferences only syncs on /settings and /profile routes
```

### 5. Response Transformation

```typescript
const order = {
  transformResponse: async (response) => {
    const data = await response.text();
    return JSON.parse(data).results;
  },
};
```

### 6. URL Path and Parameters

```typescript
const order = {
  options: {
    path: "/active", // Results in: baseUrl/active
    params: {
      limit: 10,
      offset: 0,
    },
  },
};
// Final URL: baseUrl/active?limit=10&offset=0
```

### 7. Manual Sync with Custom Action

```typescript
import { syncIndividual } from "@sirajju/use-sync";

// With custom action
const data = await syncIndividual(
  "users",
  { path: "/archived" },
  customAction // Custom redux action instead of default
);

// Basic options
const data = await syncIndividual("users", {
  path: "/active",
  params: { status: "online" },
});
```

### 8. Cache Management

```typescript
// In component
const { clearCache } = useSync(config);
clearCache("users"); // Clear specific cache
clearCache(); // Clear all cache

// Anywhere in app
import { clearCache } from "@sirajju/use-sync";
clearCache("products");
```

## 📚 API Reference

### useSync Hook

```typescript
interface useSyncProps {
  fetchItems: Map<string, string>;
  fetchOrder: order[];
  throwError?: boolean;
  onError?: (error: any) => void;
  logger?: boolean;
  logLevel?: "DEBUG" | "INFO" | "WARN" | "ERROR";
  cacheDuration?: number;
}
```

### Order Configuration

```typescript
interface order {
  key: string;
  action: (data: any) => any;
  transformResponse?: (response: Response) => Promise<any>;
  refetchOnFocus?: boolean;
  refetchOnline?: boolean;
  initialSync?: boolean;
  backgroundSync?: boolean;
  triggerEvents?: (keyof WindowEventMap)[];
  options?: {
    path?: string;
    params?: Record<string, any>;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: HeadersInit;
    // ...other fetch options
  };
  priority?: number;              // Higher number = higher priority
  includedPaths?: string[];      // Array of paths where sync is allowed
}
```

### syncIndividual Function

```typescript
function syncIndividual(
  name: string,
  options?: fetchOptions,
  customAction?: (data: any) => any
): Promise<any>;
```

## 🔧 Advanced Usage

### Background Sync

```typescript
const order = {
  key: "analytics",
  backgroundSync: true, // Won't block initial load
  action: setAnalytics,
};
```

### Error Handling

```typescript
useSync({
  throwError: true, // Throw errors instead of console
  onError: (error) => {
    notifyUser(error); // Custom error handling
  },
  // ...config
});
```

### Debug Logging

```typescript
useSync({
  logger: true,
  logLevel: "DEBUG", // "DEBUG" | "INFO" | "WARN" | "ERROR"
  // ...config
});
```

### Priority-based Syncing
```typescript
const orders = [
  {
    key: "auth",
    priority: 100,    // Will sync first
    action: setAuth
  },
  {
    key: "settings",
    priority: 50,     // Will sync second
    action: setSettings
  }
];
```

### Path-restricted Syncing
```typescript
const order = {
  key: "adminData",
  includedPaths: ['/admin', '/dashboard'],  // Only sync on these paths
  action: setAdminData
};

// No sync will occur on other paths like /home, /profile, etc.
```

## 📦 Requirements

- React 16.8+
- Redux
- React Redux

## 📄 License

ISC
