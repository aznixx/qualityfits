import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, Eye, Loader2, LogOut, Plus, RefreshCw, Search, Trash2, Upload } from "lucide-react";
import { Product } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { formatPrice } from "@/lib/format";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const brandOptions = ["Nike", "Essentials", "ASICS"] as const;
const categoryOptions = [
  { value: "sneakers", label: "Sneakers" },
  { value: "hoodies", label: "Hoodies" },
  { value: "tracksuits", label: "Tracksuits" },
] as const;

const fallbackImages: Record<string, string> = {
  Nike: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85",
  Essentials: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85",
  ASICS: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=85",
};

const defaultSizes: Record<string, string> = {
  sneakers: "39, 40, 41, 42, 43, 44, 45",
  hoodies: "XS, S, M, L, XL",
  tracksuits: "XS, S, M, L, XL",
};

const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const priceToInput = (price: number) => (price / 100).toFixed(2);

type SessionUser = {
  email?: string;
};

type ProductFormState = {
  title: string;
  brand: (typeof brandOptions)[number];
  category: (typeof categoryOptions)[number]["value"];
  price: string;
  image: string;
  imageFile: File | null;
  sizes: string;
  colors: string;
  description: string;
  inStock: boolean;
  lowStock: boolean;
};

const emptyForm = (): ProductFormState => ({
  title: "",
  brand: "Nike",
  category: "sneakers",
  price: "99.95",
  image: "",
  imageFile: null,
  sizes: defaultSizes.sneakers,
  colors: "Zwart, Wit",
  description: "",
  inStock: true,
  lowStock: false,
});

const formFromProduct = (product: Product): ProductFormState => ({
  title: product.title,
  brand: product.brand as ProductFormState["brand"],
  category: product.category as ProductFormState["category"],
  price: priceToInput(product.price),
  image: product.images[0] ?? "",
  imageFile: null,
  sizes: product.sizes.join(", "),
  colors: product.colors.join(", "),
  description: product.description,
  inStock: product.inStock,
  lowStock: product.lowStock,
});

export default function Admin() {
  const {
    products,
    adminProducts,
    addProduct,
    updateAdminProduct,
    removeAdminProduct,
    clearAdminProducts,
    uploadProductImage,
    refreshProducts,
    isSupabaseConfigured,
    loading,
    error,
  } = useProducts();

  const [user, setUser] = useState<SessionUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [form, setForm] = useState<ProductFormState>(() => emptyForm());
  const [saving, setSaving] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const canEdit = !isSupabaseConfigured || user;
  const editableSlugs = useMemo(() => new Set(adminProducts.map((product) => product.slug)), [adminProducts]);
  const previewPrice = useMemo(() => Math.round((Number(form.price.replace(",", ".")) || 0) * 100), [form.price]);
  const editingProduct = editingSlug ? adminProducts.find((product) => product.slug === editingSlug) : null;

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !needle ||
        product.title.toLowerCase().includes(needle) ||
        product.brand.toLowerCase().includes(needle) ||
        product.category.toLowerCase().includes(needle);
      const matchesBrand = brandFilter === "all" || product.brand === brandFilter;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.inStock && !product.lowStock) ||
        (stockFilter === "low-stock" && product.lowStock) ||
        (stockFilter === "sold-out" && !product.inStock);

      return matchesQuery && matchesBrand && matchesStock;
    });
  }, [brandFilter, products, query, stockFilter]);

  const stats = useMemo(
    () => [
      { label: "Totaal", value: products.length },
      { label: "Supabase items", value: adminProducts.length },
      { label: "Lage voorraad", value: products.filter((product) => product.lowStock).length },
      { label: "Uitverkocht", value: products.filter((product) => !product.inStock).length },
    ],
    [adminProducts.length, products]
  );

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, [isSupabaseConfigured]);

  const updateForm = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);

    if (error) {
      toast({ title: "Inloggen mislukt", description: error.message });
    } else {
      setPassword("");
      toast({ title: "Ingelogd", description: "Je kunt nu producten beheren." });
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const handleCategoryChange = (value: ProductFormState["category"]) => {
    setForm((current) => ({ ...current, category: value, sizes: defaultSizes[value] }));
  };

  const resetForm = () => {
    setEditingSlug(null);
    setForm(emptyForm());
  };

  const handleEdit = (product: Product) => {
    if (!editableSlugs.has(product.slug)) {
      toast({
        title: "Demo product",
        description: "Dit basisproduct staat in de code. Voeg een Supabase product toe om het te kunnen beheren.",
      });
      return;
    }

    setEditingSlug(product.slug);
    setForm(formFromProduct(product));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formPayload = async () => {
    let imageUrl = form.image.trim();
    if (form.imageFile) {
      imageUrl = await uploadProductImage(form.imageFile);
    }

    return {
      title: form.title.trim(),
      brand: form.brand,
      category: form.category,
      price: previewPrice,
      images: [imageUrl || fallbackImages[form.brand]],
      sizes: splitList(form.sizes),
      colors: splitList(form.colors),
      inStock: form.inStock,
      lowStock: form.lowStock,
      description: form.description.trim() || "Premium item toegevoegd via het QualityFits admin panel.",
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEdit) {
      toast({ title: "Log eerst in", description: "Je moet ingelogd zijn om producten op te slaan." });
      return;
    }
    if (!form.title.trim()) {
      toast({ title: "Product mist een naam", description: "Vul eerst een productnaam in." });
      return;
    }

    setSaving(true);
    try {
      const payload = await formPayload();

      if (editingSlug) {
        const updated = await updateAdminProduct(editingSlug, payload);
        toast({ title: "Product bijgewerkt", description: `${updated.title} is opgeslagen.` });
      } else {
        const created = await addProduct(payload);
        toast({ title: "Product toegevoegd", description: `${created.title} staat nu in de shop.` });
      }

      resetForm();
    } catch (error) {
      toast({
        title: "Opslaan mislukt",
        description: error instanceof Error ? error.message : "Probeer het opnieuw.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (product: Product, field: "inStock" | "lowStock") => {
    if (!editableSlugs.has(product.slug)) {
      toast({ title: "Read-only", description: "Alleen Supabase producten kunnen hier worden aangepast." });
      return;
    }

    try {
      await updateAdminProduct(product.slug, { [field]: !product[field] });
    } catch (error) {
      toast({
        title: "Bijwerken mislukt",
        description: error instanceof Error ? error.message : "Probeer het opnieuw.",
      });
    }
  };

  const handleRemove = async (slug: string) => {
    try {
      await removeAdminProduct(slug);
      if (editingSlug === slug) resetForm();
    } catch (error) {
      toast({
        title: "Verwijderen mislukt",
        description: error instanceof Error ? error.message : "Probeer het opnieuw.",
      });
    }
  };

  const handleClear = async () => {
    try {
      await clearAdminProducts();
      resetForm();
    } catch (error) {
      toast({
        title: "Verwijderen mislukt",
        description: error instanceof Error ? error.message : "Probeer het opnieuw.",
      });
    }
  };

  return (
    <div className="qf-grid">
      <div className="container py-12">
        <div className="mb-8 flex flex-col gap-5 border-b border-brand-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand-blue">Admin</p>
            <h1 className="mt-2 font-anton text-5xl uppercase leading-none md:text-7xl">Product beheer</h1>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              Beheer de live collectie, voorraadstatus, lage voorraad en uploads voor Nike, Essentials en ASICS.
            </p>
          </div>
          <button
            onClick={() => void refreshProducts()}
            className="inline-flex items-center gap-2 border border-brand-ink/15 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em]"
          >
            <RefreshCw className="h-4 w-4" /> Verversen
          </button>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-8 border border-brand-blue/30 bg-white p-5 text-sm">
            Supabase env vars ontbreken. De admin werkt nu tijdelijk lokaal via deze browser.
          </div>
        )}

        {isSupabaseConfigured && !user && (
          <form onSubmit={handleLogin} className="mb-10 max-w-xl space-y-4 bg-brand-ink p-6 text-white md:p-8">
            <h2 className="font-anton text-3xl uppercase">Admin login</h2>
            <p className="text-sm text-white/65">Log in met je Supabase admin account om producten te beheren.</p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full border border-white/15 bg-white/10 px-3 py-3 text-white placeholder:text-white/45"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Wachtwoord"
              className="w-full border border-white/15 bg-white/10 px-3 py-3 text-white placeholder:text-white/45"
              required
            />
            <button
              disabled={authLoading}
              className="inline-flex items-center gap-2 bg-brand-lime px-7 py-4 font-bold uppercase tracking-[0.16em] text-brand-ink disabled:opacity-60"
            >
              {authLoading && <Loader2 className="h-4 w-4 animate-spin" />} Inloggen
            </button>
          </form>
        )}

        {isSupabaseConfigured && user && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border border-brand-ink/10 bg-white p-4 text-sm">
            <span>
              Ingelogd als <strong>{user.email}</strong>
            </span>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 underline underline-offset-4">
              <LogOut className="h-4 w-4" /> Uitloggen
            </button>
          </div>
        )}

        {error && (
          <div className="mb-8 border border-destructive/30 bg-white p-5 text-sm text-destructive">
            Supabase fout: {error}
          </div>
        )}

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border border-brand-ink/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
              <p className="mt-2 font-anton text-4xl uppercase text-brand-ink">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr),420px]">
          <section className="space-y-6">
            <div className="border border-brand-ink/10 bg-white p-4">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr),180px,180px]">
                <label className="relative block">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Zoek product, merk of categorie"
                    className="w-full border border-border py-3 pl-10 pr-3"
                  />
                </label>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="border border-border bg-white px-3 py-3"
                >
                  <option value="all">Alle merken</option>
                  {brandOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="border border-border bg-white px-3 py-3"
                >
                  <option value="all">Alle voorraad</option>
                  <option value="in-stock">Op voorraad</option>
                  <option value="low-stock">Lage voorraad</option>
                  <option value="sold-out">Uitverkocht</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="border border-brand-ink/10 bg-white p-8 text-muted-foreground">Producten laden...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="border border-brand-ink/10 bg-white p-8 text-muted-foreground">Geen producten gevonden.</div>
            ) : (
              <div className="overflow-hidden border border-brand-ink/10 bg-white">
                <div className="grid grid-cols-[1fr,130px,160px,180px] border-b border-brand-ink/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground max-lg:hidden">
                  <span>Product</span>
                  <span>Prijs</span>
                  <span>Voorraad</span>
                  <span className="text-right">Acties</span>
                </div>
                <div className="divide-y divide-brand-ink/10">
                  {filteredProducts.map((product) => {
                    const editable = editableSlugs.has(product.slug);
                    return (
                      <div key={product.slug} className="grid gap-4 p-4 lg:grid-cols-[1fr,130px,160px,180px] lg:items-center">
                        <div className="flex gap-4">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-20 w-20 shrink-0 object-cover"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Link to={`/products/${product.slug}`} className="font-semibold hover:underline">
                                {product.title}
                              </Link>
                              {!editable && (
                                <span className="border border-brand-ink/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                  Demo
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              {product.brand} / {product.category}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                          </div>
                        </div>
                        <p className="font-semibold">{formatPrice(product.price)}</p>
                        <div className="space-y-2 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={product.inStock}
                              disabled={!canEdit || !editable}
                              onChange={() => void handleToggle(product, "inStock")}
                            />
                            Op voorraad
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={product.lowStock}
                              disabled={!canEdit || !editable}
                              onChange={() => void handleToggle(product, "lowStock")}
                            />
                            Lage voorraad
                          </label>
                        </div>
                        <div className="flex justify-start gap-2 lg:justify-end">
                          <Link
                            to={`/products/${product.slug}`}
                            className="inline-flex h-10 w-10 items-center justify-center border border-brand-ink/10 hover:bg-brand-silver"
                            aria-label={`Bekijk ${product.title}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleEdit(product)}
                            disabled={!canEdit || !editable}
                            className="inline-flex h-10 w-10 items-center justify-center border border-brand-ink/10 hover:bg-brand-silver disabled:opacity-35"
                            aria-label={`Bewerk ${product.title}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => void handleRemove(product.slug)}
                            disabled={!canEdit || !editable}
                            className="inline-flex h-10 w-10 items-center justify-center border border-brand-ink/10 hover:text-destructive disabled:opacity-35"
                            aria-label={`Verwijder ${product.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          <aside className="h-fit border border-brand-ink/10 bg-white p-6 md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-brand-blue">
                  {editingSlug ? "Bewerk product" : "Nieuw product"}
                </p>
                <h2 className="mt-2 font-anton text-4xl uppercase leading-none">
                  {editingProduct?.title || "Product toevoegen"}
                </h2>
              </div>
              {editingSlug && (
                <button onClick={resetForm} className="text-xs font-bold uppercase tracking-[0.14em] underline underline-offset-4">
                  Nieuw
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <fieldset disabled={!canEdit || saving} className="space-y-5 disabled:opacity-55">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Productnaam</label>
                  <input
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    placeholder="Nike Tech Hoodie"
                    className="w-full border border-border px-3 py-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Merk</label>
                    <select
                      value={form.brand}
                      onChange={(e) => updateForm("brand", e.target.value as ProductFormState["brand"])}
                      className="w-full border border-border bg-white px-3 py-3"
                    >
                      {brandOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Categorie</label>
                    <select
                      value={form.category}
                      onChange={(e) => handleCategoryChange(e.target.value as ProductFormState["category"])}
                      className="w-full border border-border bg-white px-3 py-3"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Prijs</label>
                  <input
                    value={form.price}
                    onChange={(e) => updateForm("price", e.target.value)}
                    inputMode="decimal"
                    placeholder="99.95"
                    className="w-full border border-border px-3 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Afbeelding uploaden</label>
                  <label className="flex min-h-[48px] cursor-pointer items-center gap-3 border border-dashed border-brand-ink/25 px-3 py-3 text-sm hover:border-brand-blue">
                    <Upload className="h-4 w-4" />
                    <span>{form.imageFile ? form.imageFile.name : "Kies productfoto"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => updateForm("imageFile", e.target.files?.[0] ?? null)}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Of afbeelding URL</label>
                  <input
                    value={form.image}
                    onChange={(e) => updateForm("image", e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-border px-3 py-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Maten</label>
                    <input
                      value={form.sizes}
                      onChange={(e) => updateForm("sizes", e.target.value)}
                      className="w-full border border-border px-3 py-3"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Kleuren</label>
                    <input
                      value={form.colors}
                      onChange={(e) => updateForm("colors", e.target.value)}
                      className="w-full border border-border px-3 py-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Beschrijving</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    rows={4}
                    className="w-full border border-border px-3 py-3"
                  />
                </div>

                <div className="grid gap-3 border border-brand-ink/10 p-4 text-sm">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(e) => updateForm("inStock", e.target.checked)}
                    />
                    Op voorraad
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.lowStock}
                      onChange={(e) => updateForm("lowStock", e.target.checked)}
                    />
                    Lage voorraad tonen
                  </label>
                </div>
              </fieldset>

              <div className="flex flex-wrap gap-3">
                <button
                  disabled={!canEdit || saving}
                  className="inline-flex items-center gap-2 bg-brand-ink px-6 py-4 font-bold uppercase tracking-[0.16em] text-white transition hover:bg-brand-lime hover:text-brand-ink disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {editingSlug ? "Opslaan" : "Toevoegen"}
                </button>
                {adminProducts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => void handleClear()}
                    disabled={!canEdit || saving}
                    className="px-4 py-4 text-sm underline underline-offset-4 disabled:opacity-50"
                  >
                    Alle Supabase items verwijderen
                  </button>
                )}
              </div>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}
