# use-sync

A powerful React hook for managing state synchronization with intelligent caching, logging, and event-driven updates.

## Features

- ⚡ Automatic state synchronization
- 📦 Intelligent request caching
- 💾 Persistent IndexedDB caching
- 🔌 Network status integration
- 🎯 Window focus detection
- 📡 Custom event triggers
- 📋 Configurable logging
- 🔒 Request deduplication
- 🔄 Redux integration
- ⏳ Loading states per item
- 🗑️ Manual cache control
- 📊 Detailed debug information
- 📘 TypeScript support

## Installation

```bash
# Using npm
npm install @sirajju/use-sync

# Using yarn
yarn add @sirajju/use-sync

# Using pnpm
pnpm add @sirajju/use-sync
```

## Basic Usage

```typescript
import { useSync } from "@sirajju/use-sync";

function App() {
  const endpoints = new Map([
    ['users', 'https://api.example.com/users'],
    ['products', 'https://api.example.com/products']
  ]);

  const fetchOrders = [
    {
      key: "users",
      action: setUsers,
      refetchOnFocus: true,
      refetchOnline: true,
      triggerEvents: ['scroll', 'resize'], // Only window events
      options: {
        headers: { "Content-Type": "application/json" }
      }
    }
  ];

  const { 
    isPending, 
    haveError, 
    loadingItems, 
    clearCache, 
    refresh 
  } = useSync({
    fetchItems: endpoints,
    fetchOrder: fetchOrders,
    logger: true,
    logLevel: "DEBUG",
    cacheDuration: 5000,
    onError: (error) => console.error(error)
  });

  // Access loading state for specific items
  console.log("Currently loading:", loadingItems);

  return <div>{/* Your UI */}</div>;
}
```

## 🎯 Latest Features (v2.2)

### Configurable Duplicate Requests
```typescript
const fetchOrders = [{
  key: "users",
  action: setUsers,
  allowDuplicates: true, // Allow parallel requests for same endpoint
  // ...other config
}];
```

### Custom Fetch Implementation
```typescript
const { isPending } = useSync({
  fetchItems: endpoints,
  fetchOrder: orders,
  customFetch: async (url, options) => {
    // Use your own fetch implementation
    return await axios.get(url, options);
  }
});
```

### Enhanced Error Handling
```typescript
const order = {
  key: "users",
  action: setUsers,
  options: {
    errorHandler: (error) => {
      // Custom error handling per request
      console.error(`Users sync failed: ${error}`);
    }
  }
};
```

## Advanced Features

### Cache Control

```typescript
import { useSync, clearCache } from "@sirajju/use-sync";

// Clear specific item's cache
clearCache("users");

// Clear all cache
clearCache();

// Configure cache durations (milliseconds)
useSync({
  // Legacy option - controls both memory and IndexedDB cache if specific durations aren't provided
  cacheDuration: 10000,  // 10 seconds
  
  // Specific control over memory cache duration
  memoryCacheDuration: 5000,  // 5 seconds
  
  // Specific control over IndexedDB cache duration
  indexDbCacheDuration: 86400000,  // 24 hours
  
  // ...other config
});

// Control cache durations at request level
syncIndividual(
  "users", 
  { 
    memoryCacheDuration: 30000,     // 30 seconds memory cache for this request
    indexDbCacheDuration: 3600000,  // 1 hour IndexedDB cache for this request
    params: { id: 123 }
  }
);
```

### IndexedDB Persistent Cache

```typescript
// Enable IndexedDB cache globally
useSync({
  indexDbCache: true,  // Enable persistent storage
  // Default cache duration is 24 hours
  // ...other config
});

// Enable for specific requests
const fetchOrders = [{
  key: "users",
  action: setUsers,
  indexDbCache: true, // Enable IndexedDB caching for this request
  // ...other config
}];

// Control caching at the individual request level
syncIndividual(
  "users", 
  { 
    useIndexDB: false, // Override any previous settings and disable IndexedDB for this specific call
    params: { id: 123 }
  }
);

// Background update with immediate cache usage
const fetchOrders = [{
  key: "users",
  action: setUsers,
  options: {
    indexDbCache: true,
    updateIndexDbData: true, // Use cache immediately but update in background
  }
}];

// IndexedDB functions are also exported for direct usage
import { 
  storeInIndexedDB,
  getFromIndexedDB, 
  deleteFromIndexedDB, 
  clearIndexedDBCache 
} from "@sirajju/use-sync";
```

### Logging System

```typescript
useSync({
  logger: true,
  logLevel: "DEBUG", // "DEBUG" | "INFO" | "WARN" | "ERROR"
  // ...other config
});
```

### Window Event Triggers

```typescript
const fetchOrders = [{
  key: "users",
  action: setUsers,
  triggerEvents: ['scroll', 'resize', 'storage'] // Only window events are supported
}];

// Data will be automatically refetched on these window events
```

### Available Window Events
Common events you can use:
- `scroll` - Window scroll
- `resize` - Window resize
- `storage` - LocalStorage changes
- `offline` - Browser goes offline
- `online` - Browser goes online
- `focus` - Window gains focus
- `blur` - Window loses focus
- `visibilitychange` - Tab visibility changes
- `beforeunload` - Before window unload
- `load` - Window load complete
- `DOMContentLoaded` - Initial HTML loaded
- `popstate` - Browser history changes

### Manual Sync with Progress Tracking

```typescript
import { syncIndividual } from "@sirajju/use-sync";

function RefreshButton() {
  const handleRefresh = async () => {
    try {
      const data = await syncIndividual("users");
      console.log("Refresh complete:", data);
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}
```

## API Reference

### useSync Hook

```typescript
interface useSyncProps {
  fetchItems: Map<string, string>;    // API endpoints
  fetchOrder: order[];                // Sync configurations
  throwError?: boolean;               // Error handling mode
  onError?: (error: any) => void;     // Error callback
  logger?: boolean;                   // Enable logging
  logLevel?: "DEBUG" | "INFO" | "WARN" | "ERROR";
  cacheDuration?: number;             // Legacy cache duration option (affects both memory and IndexedDB)
  memoryCacheDuration?: number;       // Specific in-memory cache duration in ms
  indexDbCacheDuration?: number;      // Specific IndexedDB cache duration in ms
  indexDbCache?: boolean;             // Enable IndexedDB persistent cache
  customFetch?: (url: string, options: any) => Promise<Response>; // Custom fetch
}
```

### Order Configuration

```typescript
type order = {
  key: string;                     // Unique identifier
  action: (data: any) => any;      // Redux action creator
  allowDuplicates?: boolean;       // Allow parallel requests
  refetchOnFocus?: boolean;        // Refetch on window focus
  refetchOnline?: boolean;         // Refetch when online
  indexDbCache?: boolean;          // Use IndexedDB for persistent cache
  triggerEvents?: (keyof WindowEventMap)[]; // Window event names only  options?: RequestInit & {
    indexDbCache?: boolean;        // Enable IndexedDB at option level
    updateIndexDbData?: boolean;   // Use cache, then update in background
    memoryCacheDuration?: number;  // Override memory cache duration for this request
    indexDbCacheDuration?: number; // Override IndexedDB cache duration for this request
  };           
};
```

## TypeScript Type Definitions

```typescript
// Core types
type SyncKey = string;
type EndpointURL = string;
type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

// Configuration interfaces
interface SyncConfig {
  fetchItems: Map<SyncKey, EndpointURL>;
  fetchOrder: SyncOrder[];
  throwError?: boolean;
  onError?: ErrorCallback;
  logger?: boolean;
  logLevel?: LogLevel;
  cacheDuration?: number;
  customFetch?: (url: string, options: any) => Promise<Response>;
}

interface SyncOrder {
  key: SyncKey;
  action: ActionCreator;
  allowDuplicates?: boolean;
  refetchOnFocus?: boolean;
  refetchOnline?: boolean;
  triggerEvents?: WindowEventName[];
  options?: RequestInit;
}

// Result types
interface SyncResult {
  isPending: boolean;
  haveError: boolean;
  loadingItems: SyncKey[];
  clearCache: (key?: SyncKey) => void;
  refresh: () => Promise<void>;
}
```

## Troubleshooting

### Common Issues

1. **Cache Not Clearing**
   ```typescript
   // Make sure to use the correct key
   clearCache("exact-key-name");
   ```

2. **Event Triggers Not Working**
   ```typescript
   // Only use valid window events
   triggerEvents: ['scroll', 'resize'] // ✅ Correct
   triggerEvents: ['custom-event']     // ❌ Incorrect
   ```

3. **Redux Integration**
   ```typescript
   // Ensure your action creator is properly typed
   const action: ActionCreator = (data) => ({
     type: 'SET_DATA',
     payload: data
   });
   ```

### Debug Mode

Enable detailed logging for troubleshooting:

```typescript
useSync({
  logger: true,
  logLevel: "DEBUG",
  // ...other config
});
```

## Requirements

- React 16.8+
- Redux 4.x
- React Redux 7.x
- TypeScript 4.x (for TypeScript users)

## License

ISC License
