import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <div className="group">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-brand-silver aspect-[4/5] border border-brand-ink/10">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink backdrop-blur">
            {product.brand}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product, { size: product.sizes[1] ?? product.sizes[0] });
            }}
            className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition bg-brand-ink text-white text-xs font-bold uppercase tracking-[0.18em] py-3 hover:bg-brand-lime hover:text-brand-ink"
          >
            In Winkelwagen
          </button>
        </div>
      </Link>
      <div className="pt-4 grid grid-cols-[1fr,auto] gap-3">
        <Link
          to={`/products/${product.slug}`}
          className="text-sm font-semibold leading-snug hover:underline underline-offset-4"
        >
          {product.title}
        </Link>
        <p className="text-sm font-bold">{formatPrice(product.price)}</p>
        <p className="col-span-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{product.category}</p>
      </div>
    </div>
  );
}
