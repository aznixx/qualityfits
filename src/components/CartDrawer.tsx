import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, subtotal, removeItem, setQty } = useCart();
  return (
    <Sheet open={drawerOpen} onOpenChange={(o) => (o ? null : closeDrawer())}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle className="font-anton tracking-widest text-lg">JOUW WINKELWAGEN</SheetTitle>
          <SheetDescription className="sr-only">Bekijk en beheer de items in je winkelwagen.</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
            <p className="text-base">Je winkelwagen is leeg.</p>
            <p className="text-muted-foreground">Tijd voor een nieuwe fit.</p>
            <Link
              to="/collections/all-products"
              onClick={closeDrawer}
              className="mt-2 bg-brand-ink text-white font-bold uppercase tracking-[0.16em] text-sm px-6 py-3 hover:bg-brand-lime hover:text-brand-ink"
            >
              SHOP NU
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {lines.map((l) => (
                <div key={l.key} className="flex gap-3 p-4">
                  <img src={l.image} alt={l.title} className="h-24 w-20 object-cover bg-brand-silver" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium truncate">{l.title}</p>
                      <button onClick={() => removeItem(l.key)} aria-label="Remove" className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Maat {l.size}</p>
                    {l.color && <p className="text-xs text-muted-foreground">Kleur: {l.color}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center border border-border">
                        <button onClick={() => setQty(l.key, l.qty - 1)} className="px-2 py-1">-</button>
                        <span className="px-3 text-sm">{l.qty}</span>
                        <button onClick={() => setQty(l.key, l.qty + 1)} className="px-2 py-1">+</button>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(l.price * l.qty)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotaal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Gratis verzending vanaf €100.</p>
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="block text-center bg-brand-ink text-white font-bold uppercase tracking-[0.16em] py-3 hover:bg-brand-lime hover:text-brand-ink"
              >
                BEKIJK WINKELWAGEN
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
