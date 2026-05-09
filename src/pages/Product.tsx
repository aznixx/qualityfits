import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { categoryNames } from "@/data/categories";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";
import { ProductGrid } from "@/components/ProductGrid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RotateCcw, Shirt, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

const sizeRows = [
  ["XS", "88", "66"],
  ["S", "96", "68"],
  ["M", "102", "71"],
  ["L", "108", "73"],
  ["XL", "114", "75"],
  ["39-45", "EU", "Sneakers"],
];

export default function ProductPage() {
  const { slug = "" } = useParams();
  const { getProduct, getRelated } = useProducts();
  const product = getProduct(slug);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const { addItem } = useCart();

  if (!product) return <NotFound />;

  const related = getRelated(product.slug, product.category);

  const handleAdd = () => {
    if (!size) {
      alert("Selecteer eerst een maat.");
      return;
    }
    addItem(product, { size, color: color ?? product.colors[0] });
  };

  return (
    <div className="container py-8">
      <div className="text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:underline">Home</Link> /{" "}
        <Link to={`/collections/${product.category}`} className="hover:underline">
          {categoryNames[product.category]}
        </Link>{" "}
        / <span>{product.title}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="grid grid-cols-[80px,1fr] gap-3">
          <div className="flex flex-col gap-2">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActive(i)}
                className={cn(
                  "aspect-[4/5] bg-brand-silver overflow-hidden border-2",
                  i === active ? "border-brand-blue" : "border-transparent"
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="aspect-[4/5] bg-brand-silver overflow-hidden border border-brand-ink/10">
            <img
              src={product.images[active]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            QualityFits / {categoryNames[product.category] ?? product.category}
          </p>
          <h1 className="font-anton text-4xl md:text-5xl uppercase mt-2">{product.title}</h1>
          <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">{product.brand}</p>
          <p className="mt-3 text-2xl font-semibold">{formatPrice(product.price)}</p>

          {product.lowStock && (
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-brand-ink">
              <span className="h-2 w-2 rounded-full bg-brand-lime pulse-dot inline-block" />
              Nog maar enkele op voorraad
            </p>
          )}

          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest mb-2">Maat</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "h-11 min-w-14 border px-3 text-sm font-medium",
                    size === s
                      ? "bg-brand-ink text-white border-brand-ink"
                      : "border-border hover:border-brand-blue"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest mb-2">Kleur</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "min-h-10 border px-4 text-sm font-medium",
                    (color ?? product.colors[0]) === c
                      ? "bg-brand-ink text-white border-brand-ink"
                      : "border-border hover:border-brand-blue"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="mt-6 w-full bg-brand-ink text-white font-bold uppercase tracking-[0.18em] py-4 hover:bg-brand-lime hover:text-brand-ink transition"
          >
            IN WINKELWAGEN
          </button>

          <Dialog>
            <DialogTrigger asChild>
              <button className="mt-3 w-full border border-border py-3 text-sm hover:border-brand-blue">
                Maattabel
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-anton tracking-widest">MAATTABEL</DialogTitle>
                <DialogDescription className="sr-only">
                  Referentiematen voor kleding en sneakers.
                </DialogDescription>
              </DialogHeader>
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr className="border-b border-border">
                    <th className="py-2">Maat</th><th>Borst (cm)</th><th>Lengte (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeRows.map((r) => (
                    <tr key={r[0]} className="border-b border-border last:border-0">
                      <td className="py-2">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DialogContent>
          </Dialog>

          <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-5">
            {[
              { icon: Truck, label: "Snelle Verzending" },
              { icon: RotateCcw, label: "Eenvoudig Retour" },
              { icon: Shirt, label: "Premium Merken" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <Icon className="h-5 w-5" />
                <p className="text-[11px] uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>

          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="desc">
              <AccordionTrigger className="font-anton tracking-widest text-sm">BESCHRIJVING</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {product.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ship">
              <AccordionTrigger className="font-anton tracking-widest text-sm">VERZENDING & RETOUR</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Bestellingen worden snel verwerkt. Gratis verzending vanaf €100. Niet tevreden? Retourneren is eenvoudig.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="size">
              <AccordionTrigger className="font-anton tracking-widest text-sm">MAATTABEL</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Zie de maattabel hierboven. Pasvorm valt normaal, bestel je gebruikelijke maat.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-anton text-2xl md:text-3xl uppercase mb-8">Misschien vind je dit ook leuk</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
