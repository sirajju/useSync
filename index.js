import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
let orders = [];
let items = new Map();
let options;
const throwErrorNow = (message) => {
    if (options && options.throwError)
        throw new Error(message);
    else
        console.error(message);
};
let myDispatch;
const useSync = ({ fetchOrder, fetchItems, throwError = true, ...rest }) => {
    options = { ...rest, fetchItems, fetchOrder };
    items = fetchItems;
    orders = fetchOrder;
    const [syncState, setSyncState] = useState({
        isPending: false,
        haveError: false,
    });
    const dispatch = useDispatch();
    myDispatch = dispatch;
    useEffect(() => {
        const syncData = async () => {
            const refetchOnline = [];
            const refetchOnFocus = [];
            setSyncState({ isPending: true, haveError: false });
            try {
                const promises = fetchOrder.map(async (config) => {
                    const url = fetchItems.get(config.key);
                    if (!url)
                        return throwErrorNow(`url not found for ${config.key}`);
                    if (config.refetchOnline)
                        refetchOnline.push(config.key);
                    if (config.refetchOnFocus)
                        refetchOnFocus.push(config.key);
                    const response = await fetch(url, config.options || {});
                    if (!response.ok)
                        return throwErrorNow(`failedd to fetch ${config.key}`);
                    const data = await response.json();
                    dispatch(config.action(data));
                });
                await Promise.all(promises);
                addOnlineListener(refetchOnline, dispatch);
                addFocusListener(refetchOnFocus, dispatch);
                setSyncState({ isPending: false, haveError: false });
            }
            catch (error) {
                if (options.onError)
                    options.onError(error);
                setSyncState({ isPending: false, haveError: true });
            }
        };
        syncData();
    }, [dispatch]);
    return syncState;
};
const syncIndividual = async (name, dispatch = myDispatch) => {
    if (typeof dispatch !== "function")
        return throwErrorNow(`Expected dispatch(useDispatch()) function got ${typeof dispatch}`);
    const config = orders.find((item) => item.key === name);
    const url = items.get(name);
    if (!url || !config)
        return throwErrorNow(`no url found for item ${name}`);
    const response = await fetch(url, config.options || {});
    if (!response.ok) {
        return throwErrorNow(`Failed to fetch ${name} ${response.statusText}`);
    }
    const data = await response.json();
    dispatch(config.action(data));
    return data;
};
const addOnlineListener = (list, dispatch) => {
    window.addEventListener("online", () => {
        for (const name of list)
            syncIndividual(name, dispatch);
    });
};
const addFocusListener = (list, dispatch) => {
    window.addEventListener("focus", () => {
        for (const name of list)
            syncIndividual(name, dispatch);
    });
};
export { useSync, syncIndividual };
