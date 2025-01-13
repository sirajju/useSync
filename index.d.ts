import { order } from "./types";
interface useSyncProps {
    fetchItems: Map<string, string>;
    fetchOrder: order[];
    throwError?: boolean;
    onError?: (error: any) => void;
}
declare const useSync: ({ fetchOrder, fetchItems, throwError, ...rest }: useSyncProps) => any;
declare const syncIndividual: (name: string, dispatch?: (action: any) => void) => Promise<any>;
export { useSync, syncIndividual };
