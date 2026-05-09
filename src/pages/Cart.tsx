import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { Instagram, X } from "lucide-react";
import { INSTAGRAM_URL, INSTAGRAM_USERNAME } from "@/lib/instagram";

export default function Cart() {
  const { lines, subtotal, removeItem, setQty } = useCart();

  if (lines.length === 0) {
    return (
      <div className="container py-24 text-center">
        <h1 className="font-anton text-4xl uppercase">Je winkelwagen is leeg</h1>
        <p className="mt-3 text-muted-foreground">Tijd voor een nieuwe fit.</p>
        <Link
          to="/collections/all-products"
          className="inline-block mt-8 bg-brand-ink text-white font-bold uppercase tracking-[0.18em] px-8 py-4 hover:bg-brand-lime hover:text-brand-ink"
        >
          SHOP NU
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="font-anton text-4xl md:text-5xl uppercase mb-8">Jouw winkelwagen</h1>
      <div className="grid lg:grid-cols-[1fr,360px] gap-10">
        <div className="divide-y divide-border border-y border-border">
          {lines.map((l) => (
            <div key={l.key} className="grid grid-cols-[100px,1fr] sm:grid-cols-[120px,1fr,auto] gap-4 py-5">
              <img src={l.image} alt={l.title} className="bg-brand-silver w-full aspect-[4/5] object-cover" />
              <div>
                <Link to={`/products/${l.slug}`} className="font-medium hover:underline">{l.title}</Link>
                <p className="text-xs text-muted-foreground mt-1">Maat {l.size}</p>
                {l.color && <p className="text-xs text-muted-foreground">Kleur: {l.color}</p>}
                <div className="mt-3 inline-flex items-center border border-border">
                  <button onClick={() => setQty(l.key, l.qty - 1)} className="px-3 py-1">-</button>
                  <span className="px-4 text-sm">{l.qty}</span>
                  <button onClick={() => setQty(l.key, l.qty + 1)} className="px-3 py-1">+</button>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                <p className="font-semibold">{formatPrice(l.price * l.qty)}</p>
                <button
                  onClick={() => removeItem(l.key)}
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs"
                >
                  <X className="h-3 w-3" /> Verwijderen
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit border border-brand-ink/10 p-6 bg-white space-y-4">
          <h2 className="font-anton tracking-widest">ORDEROVERZICHT</h2>
          <div className="flex justify-between text-sm">
            <span>Subtotaal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Verzending</span>
            <span>{subtotal >= 10000 ? "Gratis" : "Wordt berekend"}</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between">
            <span className="font-anton tracking-widest">TOTAAL</span>
            <span className="font-semibold text-lg">{formatPrice(subtotal)}</span>
          </div>

          <div className="bg-brand-silver border-l-4 border-brand-blue p-4 text-sm leading-relaxed">
            <p className="font-semibold mb-1">Klaar om te bestellen?</p>
            <p className="text-muted-foreground">
              Stuur ons een DM op Instagram met je winkelwagen. We bevestigen voorraad, betaling en verzending direct.
            </p>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-lime text-brand-ink font-bold uppercase tracking-[0.16em] py-4 hover:bg-brand-ink hover:text-white transition"
          >
            <Instagram className="h-5 w-5" /> BESTELLEN VIA INSTAGRAM
          </a>
          <p className="text-center text-xs text-muted-foreground">
            Instagram: <span className="font-semibold text-foreground">@{INSTAGRAM_USERNAME}</span>
          </p>

          <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">Verder winkelen</Link>
        </aside>
      </div>
    </div>
  );
}
