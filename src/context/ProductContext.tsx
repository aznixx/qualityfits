import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Product, products as baseProducts } from "@/data/products";
import { isSupabaseConfigured, ProductRow, productImageBucket, supabase } from "@/lib/supabase";

const STORAGE_KEY = "qualityfits-admin-products";

const brandSlugs: Record<string, string> = {
  essentials: "Essentials",
  nike: "Nike",
  asics: "ASICS",
};

type ProductInput = Omit<Product, "id" | "slug"> & {
  slug?: string;
};

type ProductCtx = {
  products: Product[];
  adminProducts: Product[];
  loading: boolean;
  error: string | null;
  isSupabaseConfigured: boolean;
  refreshProducts: () => Promise<void>;
  addProduct: (product: ProductInput) => Promise<Product>;
  removeAdminProduct: (slug: string) => Promise<void>;
  clearAdminProducts: () => Promise<void>;
  uploadProductImage: (file: File) => Promise<string>;
  getProduct: (slug: string) => Product | undefined;
  getProductsByCategory: (slug: string) => Product[];
  getRelated: (slug: string, category: string) => Product[];
  bestSellers: () => Product[];
};

const ProductContext = createContext<ProductCtx | null>(null);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const uniqueSlug = (base: string, existing: Product[]) => {
  let slug = base || "product";
  let i = 2;
  while (existing.some((product) => product.slug === slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
};

const fromRow = (row: ProductRow): Product => ({
  id: row.slug,
  slug: row.slug,
  title: row.title,
  brand: row.brand,
  category: row.category,
  price: row.price,
  images: row.images,
  sizes: row.sizes,
  colors: row.colors,
  inStock: row.in_stock,
  lowStock: row.low_stock,
  description: row.description,
});

const toRow = (product: Product): Omit<ProductRow, "id" | "created_at"> => ({
  slug: product.slug,
  title: product.title,
  brand: product.brand,
  category: product.category,
  price: product.price,
  images: product.images,
  sizes: product.sizes,
  colors: product.colors,
  in_stock: product.inStock,
  low_stock: product.lowStock,
  description: product.description,
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const refreshProducts = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;

    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setAdminProducts(((data ?? []) as ProductRow[]).map(fromRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) {
      void refreshProducts();
      setHydrated(true);
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAdminProducts(JSON.parse(raw));
    } catch {
      setAdminProducts([]);
    }
    setHydrated(true);
  }, [refreshProducts]);

  useEffect(() => {
    if (!isSupabaseConfigured && hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProducts));
    }
  }, [adminProducts, hydrated]);

  const products = useMemo(() => [...baseProducts, ...adminProducts], [adminProducts]);

  const addProduct = useCallback(
    async (product: ProductInput) => {
      const slug = uniqueSlug(product.slug ?? slugify(`${product.brand}-${product.title}`), products);
      const next: Product = {
        ...product,
        id: slug,
        slug,
      };

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("products")
          .insert(toRow(next))
          .select("*")
          .single();

        if (error) throw new Error(error.message);

        const created = fromRow(data as ProductRow);
        setAdminProducts((current) => [created, ...current]);
        return created;
      }

      setAdminProducts((current) => [...current, next]);
      return next;
    },
    [products]
  );

  const removeAdminProduct = useCallback(async (slug: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("products").delete().eq("slug", slug);
      if (error) throw new Error(error.message);
    }
    setAdminProducts((current) => current.filter((product) => product.slug !== slug));
  }, []);

  const clearAdminProducts = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      const slugs = adminProducts.map((product) => product.slug);
      if (slugs.length > 0) {
        const { error } = await supabase.from("products").delete().in("slug", slugs);
        if (error) throw new Error(error.message);
      }
    }
    setAdminProducts([]);
  }, [adminProducts]);

  const uploadProductImage = useCallback(async (file: File) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is niet geconfigureerd. Gebruik tijdelijk een afbeelding URL.");
    }

    const extension = file.name.split(".").pop() || "jpg";
    const path = `products/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from(productImageBucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from(productImageBucket).getPublicUrl(path);
    return data.publicUrl;
  }, []);

  const value = useMemo<ProductCtx>(
    () => ({
      products,
      adminProducts,
      loading,
      error,
      isSupabaseConfigured,
      refreshProducts,
      addProduct,
      removeAdminProduct,
      clearAdminProducts,
      uploadProductImage,
      getProduct: (slug) => products.find((product) => product.slug === slug),
      getProductsByCategory: (slug) => {
        if (slug === "all-products") return products;
        const brand = brandSlugs[slug];
        if (brand) return products.filter((product) => product.brand === brand);
        return products.filter((product) => product.category === slug);
      },
      getRelated: (slug, category) =>
        products.filter((product) => product.slug !== slug && product.category === category).slice(0, 4),
      bestSellers: () => products.slice(0, 8),
    }),
    [
      addProduct,
      adminProducts,
      clearAdminProducts,
      error,
      loading,
      products,
      refreshProducts,
      removeAdminProduct,
      uploadProductImage,
    ]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
