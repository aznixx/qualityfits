import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { categoryNames } from "@/data/categories";
import { ProductGrid } from "@/components/ProductGrid";
import { RequestCountry } from "@/components/RequestCountry";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts } from "@/context/ProductContext";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "39", "40", "41", "42", "43", "44", "45"];
const SORTS = [
  { id: "newest", label: "Nieuwste" },
  { id: "price-asc", label: "Prijs: laag naar hoog" },
  { id: "price-desc", label: "Prijs: hoog naar laag" },
] as const;

export default function Collection() {
  const { slug = "all-products" } = useParams();
  const name = categoryNames[slug] ?? "Alle Items";
  const { getProductsByCategory } = useProducts();

  const [sizeFilter, setSizeFilter] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(250);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("newest");

  const filtered = useMemo(() => {
    let list = getProductsByCategory(slug);
    if (sizeFilter.length) list = list.filter((p) => p.sizes.some((s) => sizeFilter.includes(s)));
    list = list.filter((p) => p.price / 100 <= maxPrice);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [getProductsByCategory, slug, sizeFilter, maxPrice, sort]);

  const toggleSize = (s: string) =>
    setSizeFilter((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const activePills: { label: string; onClear: () => void }[] = [
    ...sizeFilter.map((s) => ({ label: `Maat ${s}`, onClear: () => toggleSize(s) })),
    ...(maxPrice < 250 ? [{ label: `Tot €${maxPrice}`, onClear: () => setMaxPrice(250) }] : []),
  ];

  const Filters = (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold uppercase tracking-[0.18em] text-xs mb-3">Maat</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={cn(
                "h-9 min-w-12 border px-2 text-sm",
                sizeFilter.includes(s)
                  ? "bg-brand-ink text-white border-brand-ink"
                  : "border-border bg-white hover:border-brand-blue"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold uppercase tracking-[0.18em] text-xs mb-3">Max. prijs</h3>
        <input
          type="range"
          min={25}
          max={250}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-blue"
        />
        <p className="text-xs text-muted-foreground mt-2">Tot €{maxPrice}</p>
      </div>
    </div>
  );

  return (
    <div className="qf-grid">
      <div className="container py-12">
        <div className="mb-10 border-b border-brand-ink/10 pb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-blue">Collectie</p>
          <h1 className="font-anton text-5xl md:text-7xl uppercase mt-2 leading-none">{name}</h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-2xl">
            Premium items van Nike, Essentials en ASICS. Geselecteerd voor cleane dagelijkse fits.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6 gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <button className="lg:hidden inline-flex items-center gap-2 border border-border bg-white px-3 py-2 text-sm">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader><SheetTitle className="font-anton tracking-widest">FILTERS</SheetTitle></SheetHeader>
              <div className="mt-6">{Filters}</div>
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Sorteer</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border border-border bg-white px-3 py-2 text-sm"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {activePills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activePills.map((p) => (
              <button
                key={p.label}
                onClick={p.onClear}
                className="inline-flex items-center gap-2 bg-white border border-brand-ink/10 px-3 py-1 text-xs"
              >
                {p.label} <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-[220px,1fr] gap-10">
          <aside className="hidden lg:block border-r border-brand-ink/10 pr-8">{Filters}</aside>
          <ProductGrid products={filtered} />
        </div>

        <div className="mt-16 -mx-4 md:-mx-6 lg:-mx-8">
          <RequestCountry />
        </div>
      </div>
    </div>
  );
}
