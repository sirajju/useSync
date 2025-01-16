# use-sync

A powerful React hook for managing state synchronization with intelligent caching, logging, and event-driven updates.

## Features

- 🚀 Automatic state synchronization
- 💾 Intelligent request caching
- 🌐 Network status integration
- 👁️ Window focus detection
- 🎯 Custom event triggers
- 📝 Configurable logging
- 🛡️ Request deduplication
- ⚛️ Redux integration
- 💫 Loading states per item
- 🔄 Manual cache control
- 📊 Detailed debug information
- 🎨 TypeScript support

## Installation

```bash
npm install @sirajju/use-sync
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

## Advanced Features

### Cache Control

```typescript
import { useSync, clearCache } from "@sirajju/use-sync";

// Clear specific item's cache
clearCache("users");

// Clear all cache
clearCache();

// Configure cache duration (milliseconds)
useSync({
  cacheDuration: 10000,  // 10 seconds
  // ...other config
});
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
  cacheDuration?: number;             // Cache duration in ms
}

interface SyncResult {
  isPending: boolean;                 // Global loading state
  haveError: boolean;                 // Error state
  loadingItems: string[];            // Currently loading items
  clearCache: (key?: string) => void; // Cache control
  refresh: () => Promise<void>;       // Manual refresh
}
```

### Order Configuration

```typescript
type order = {
  key: string;                     // Unique identifier
  action: (data: any) => any;      // Redux action creator
  refetchOnFocus?: boolean;        // Refetch on window focus
  refetchOnline?: boolean;         // Refetch when online
  triggerEvents?: (keyof WindowEventMap)[]; // Window event names only
  options?: RequestInit;           // Fetch options
};
```

## Features in Detail

1. **Smart Caching**
   - Automatic request deduplication
   - Configurable cache duration
   - Manual cache control
   - Per-item cache management

2. **Advanced Event System**
   - Window focus detection
   - Online/offline handling
   - Custom event triggers
   - Cleanup on unmount

3. **Debugging Tools**
   - Colored console logging
   - Configurable log levels
   - Detailed error tracking
   - Request timing information

4. **Performance Optimizations**
   - Request batching
   - Loading state granularity
   - Memory leak prevention
   - Efficient re-render control

## Requirements

- React 16.8+
- Redux
- React Redux

## License

ISC License
