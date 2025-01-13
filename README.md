# use-sync

A powerful React hook for managing state synchronization with automatic refetching capabilities based on online status and window focus.

## Features

- 🔄 Automatic state synchronization
- 🌐 Refetch on network reconnection
- 👁️ Refetch on window focus
- 🎯 Configurable fetch options
- ⚛️ Redux integration
- 🔍 TypeScript support
- 💥 Flexible error handling
- 🔄 Manual sync with return data

## Installation

```bash
npm install @sirajju/use-sync
```

## Usage

### Basic Example

```typescript
import { useSync } from "@sirajju/use-sync";
import { setUsers, setProducts } from "./store/actions";

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
      options: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    },
    {
      key: "products",
      action: setProducts,
      refetchOnFocus: false,
      refetchOnline: true,
    },
  ];

  const { isPending, haveError } = useSync({
    fetchItems: endpoints,
    fetchOrder: fetchOrders,
    throwError: false, // Optional: controls error handling
    onError: (error) => {
      console.error('Sync error:', error);
    }
  });

  if (isPending) return <div>Loading...</div>;
  if (haveError) return <div>Error occurred</div>;

  return <div>Data loaded successfully!</div>;
}
```

### Manual Sync with Data Return

```typescript
import { syncIndividual } from "@sirajju/use-sync";

function RefreshButton() {
  const handleRefresh = async () => {
    try {
      // dispatch is optional - will use internal dispatch if not provided
      const userData = await syncIndividual("users");
      console.log("Users data refreshed:", userData);
    } catch (error) {
      console.error("Failed to refresh users:", error);
    }
  };

  return <button onClick={handleRefresh}>Refresh Users</button>;
}
```

## API Reference

### useSync Hook

```typescript
interface useSyncProps {
  fetchItems: Map<string, string>;  // Map of key-URL pairs
  fetchOrder: order[];              // Array of fetch configurations
  throwError?: boolean;             // Control error throwing behavior
  onError?: (error: any) => void;   // Error callback handler
}

const { isPending, haveError } = useSync(props: useSyncProps);
```

### Order Configuration

```typescript
type order = {
  key: string;                    // Unique identifier matching fetchItems key
  action: (arg: any) => any;      // Redux action creator
  refetchOnFocus?: boolean;       // Refetch when window gains focus
  refetchOnline?: boolean;        // Refetch when network connection is restored
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
```

### syncIndividual Function

```typescript
syncIndividual(
  name: string,                    // Key of the item to sync
  dispatch?: (action: any) => void // Optional Redux dispatch function
): Promise<any>                    // Returns the fetched data
```

## Features in Detail

1. **Error Handling**
   - Configurable error throwing behavior
   - Optional error callback handler
   - Console fallback for non-throwing errors

2. **Automatic Synchronization**
   - Initial fetch for all configured endpoints
   - Managed loading and error states
   - Detailed request configuration support

3. **Network Status Integration**
   - Auto-refetch on network reconnection
   - Configurable per endpoint

4. **Focus-based Updates**
   - Refetch on window focus
   - Keep data fresh in long-running applications

5. **Redux Integration**
   - Flexible dispatch handling
   - Optional manual dispatch support
   - Automatic state updates

## Requirements

- React 16.8+
- Redux
- React Redux

## License

ISC License
