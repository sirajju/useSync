import { order } from "./types";
interface useSyncProps {
    fetchItems: Map<string, string>;
    fetchOrder: order[];
}
declare const useSync: ({ fetchOrder, fetchItems }: useSyncProps) => any;
declare const syncIndividual: (name: string, dispatch: (action: any) => void) => Promise<void>;
export { useSync, syncIndividual };
//# sourceMappingURL=index.d.ts.map