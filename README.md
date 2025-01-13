# use-sync

A powerful React hook for managing state synchronization with automatic refetching capabilities based on online status and window focus.

## Features

- 🔄 Automatic state synchronization
- 🌐 Refetch on network reconnection
- 👁️ Refetch on window focus
- 🎯 Configurable fetch options
- ⚛️ Redux integration
- 🔍 TypeScript support

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
  const endpoints = new Map();

  endPoints.set("users", "https://api.example.com/users");
  endPoints.set("products", "https://api.example.com/products");

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
  });

  if (isPending) return <div>Loading...</div>;
  if (haveError) return <div>Error occurred</div>;

  return <div>Data loaded successfully!</div>;
}
```

### Manual Sync

You can also trigger synchronization manually for specific items:

```typescript
import { syncIndividual } from "@sirajju/use-sync";
import { useDispatch } from "react-redux";

function RefreshButton() {
  const dispatch = useDispatch();

  const handleRefresh = async () => {
    try {
      await syncIndividual("users", dispatch);
      console.log("Users data refreshed");
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
const { isPending, haveError } = useSync({
  fetchItems: Map<string, string>,  // Map of key-URL pairs
  fetchOrder: order[]               // Array of fetch configurations
});
```

### Order Configuration

```typescript
type order = {
  key: string; // Unique identifier matching fetchItems key
  action: (arg: any) => any; // Redux action creator
  refetchOnFocus?: boolean; // Refetch when window gains focus
  refetchOnline?: boolean; // Refetch when network connection is restored
  options?: RequestInit; // Fetch API options
};
```

### syncIndividual Function

```typescript
syncIndividual(
  name: string,                    // Key of the item to sync
  dispatch: (action: any) => void  // Redux dispatch function
): Promise<void>
```

## Features in Detail

1. **Automatic Synchronization**

   - Performs initial fetch for all configured endpoints
   - Manages loading and error states

2. **Network Status Integration**

   - Automatically refetches data when network connection is restored
   - Configurable per endpoint

3. **Focus-based Updates**

   - Refetches data when browser window regains focus
   - Useful for keeping data fresh in long-running applications

4. **Redux Integration**
   - Seamlessly dispatches actions with fetched data
   - Works with any Redux setup

## Requirements

- React 16.8+
- Redux
- React Redux

## License

ISC License
