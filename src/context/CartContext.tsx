import { createContext, useContext, useEffect, useMemo, useReducer, useState, ReactNode } from "react";
import { Product } from "@/data/products";

export type CartLine = {
  key: string; // unique per product+size+color
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  size: string;
  color?: string;
  qty: number;
};

type State = { lines: CartLine[] };
type Action =
  | { type: "add"; line: CartLine }
  | { type: "remove"; key: string }
  | { type: "qty"; key: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; state: State };

const initial: State = { lines: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const existing = state.lines.find((l) => l.key === action.line.key);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.key === action.line.key ? { ...l, qty: l.qty + action.line.qty } : l
          ),
        };
      }
      return { lines: [...state.lines, action.line] };
    }
    case "remove":
      return { lines: state.lines.filter((l) => l.key !== action.key) };
    case "qty":
      return {
        lines: state.lines.map((l) => (l.key === action.key ? { ...l, qty: Math.max(1, action.qty) } : l)),
      };
    case "clear":
      return initial;
  }
}

type Ctx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addItem: (p: Product, opts: { size: string; color?: string; qty?: number }) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  bump: number;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("qualityfits-cart");
      if (raw) dispatch({ type: "hydrate", state: JSON.parse(raw) });
    } catch {
      dispatch({ type: "hydrate", state: initial });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("qualityfits-cart", JSON.stringify(state));
  }, [state, hydrated]);

  const value = useMemo<Ctx>(() => {
    const count = state.lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = state.lines.reduce((s, l) => s + l.qty * l.price, 0);
    return {
      lines: state.lines,
      count,
      subtotal,
      addItem: (p, { size, color, qty = 1 }) => {
        const selectedColor = color ?? p.colors[0];
        const key = `${p.id}-${size}-${selectedColor}`;
        dispatch({
          type: "add",
          line: {
            key,
            productId: p.id,
            slug: p.slug,
            title: p.title,
            image: p.images[0],
            price: p.price,
            size,
            color: selectedColor,
            qty,
          },
        });
        setBump((b) => b + 1);
        setDrawerOpen(true);
      },
      removeItem: (key) => dispatch({ type: "remove", key }),
      setQty: (key, qty) => dispatch({ type: "qty", key, qty }),
      clear: () => dispatch({ type: "clear" }),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      bump,
    };
  }, [state, drawerOpen, bump]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
