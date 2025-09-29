import { create } from "zustand";

type Item = { productId: number; qty: number };

type CartState = {
  items: Item[];
  set: (items: Item[]) => void;
  add: (item: Item) => void;
  update: (item: Item) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  set: (items) => set({ items }),
  add: (it) => {
    const cur = get().items.slice();
    const idx = cur.findIndex((i) => i.productId === it.productId);
    if (idx >= 0) cur[idx] = { ...cur[idx], qty: cur[idx].qty + it.qty };
    else cur.push(it);
    set({ items: cur });
  },
  update: (it) => {
    const cur = get().items.map((i) => (i.productId === it.productId ? it : i)).filter((i) => i.qty > 0);
    set({ items: cur });
  },
  remove: (productId) => {
    set({ items: get().items.filter((i) => i.productId !== productId) });
  },
  clear: () => set({ items: [] }),
}));
