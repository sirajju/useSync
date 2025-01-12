import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { order } from "./types";

let orders: order[] = [];
let items: Map<string, string> = new Map();

interface useSyncProps {
  fetchItems: Map<string, string>;
  fetchOrder: order[];
}

const useSync = ({ fetchOrder, fetchItems }: useSyncProps) => {
  items = fetchItems;
  orders = fetchOrder;
  const [syncState, setSyncState] = useState({
    isPending: false,
    haveError: false,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const syncData = async () => {
      const refetchOnline: string[] = [];
      const refetchOnFocus: string[] = [];
      setSyncState({ isPending: true, haveError: false });

      try {
        const promises = fetchOrder.map(async (config) => {
          const url = fetchItems.get(config.key);
          if (!url) throw new Error(`url not found for ${config.key}`);

          if (config.refetchOnline) refetchOnline.push(config.key);
          if (config.refetchOnFocus) refetchOnFocus.push(config.key);
          const response = await fetch(url, config.options || {});
          if (!response.ok) throw new Error(`failedd to fetch ${config.key}`);
          const data = await response.json();
          dispatch(config.action(data));
        });

        await Promise.all(promises);
        addOnlineListener(refetchOnline, dispatch);
        addFocusListener(refetchOnFocus, dispatch);
        setSyncState({ isPending: false, haveError: false });
      } catch (error) {
        setSyncState({ isPending: false, haveError: true });
      }
    };
    syncData();
  }, [dispatch]);
  return syncState;
};

const syncIndividual = async (
  name: string,
  dispatch: (action: any) => void
) => {
  if (typeof dispatch !== "function")
    throw new Error(
      `Expected dispatch(useDispatch()) function got ${typeof dispatch}`
    );
  const config = orders.find((item) => item.key === name);
  const url = items.get(name);
  if (!url || !config) throw new Error(`no url found for item ${name}`);

  const response = await fetch(url, config.options || {});
  if (!response.ok) {
    throw new Error(`Failed to fetch ${name} ${response.statusText}`);
  }
  const data = await response.json();
  dispatch(config.action(data));
};

const addOnlineListener = (list: string[], dispatch: (action: any) => void) => {
  window.addEventListener("online", () => {
    for (const name of list) syncIndividual(name, dispatch);
  });
};

const addFocusListener = (list: string[], dispatch: (action: any) => void) => {
  window.addEventListener("focus", () => {
    for (const name of list) syncIndividual(name, dispatch);
  });
};

export { useSync, syncIndividual };
