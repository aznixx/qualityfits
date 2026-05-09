import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, LogOut, Plus, Trash2, Upload } from "lucide-react";
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

type SessionUser = {
  email?: string;
};

export default function Admin() {
  const {
    adminProducts,
    addProduct,
    removeAdminProduct,
    clearAdminProducts,
    uploadProductImage,
    isSupabaseConfigured,
    loading,
    error,
  } = useProducts();

  const [user, setUser] = useState<SessionUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState<(typeof brandOptions)[number]>("Nike");
  const [category, setCategory] = useState<(typeof categoryOptions)[number]["value"]>("sneakers");
  const [price, setPrice] = useState("99.95");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState(defaultSizes.sneakers);
  const [colors, setColors] = useState("Zwart, Wit");
  const [description, setDescription] = useState("");
  const [lowStock, setLowStock] = useState(false);
  const [saving, setSaving] = useState(false);

  const previewPrice = useMemo(() => Math.round((Number(price.replace(",", ".")) || 0) * 100), [price]);
  const canEdit = !isSupabaseConfigured || user;

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

  const handleCategoryChange = (value: typeof category) => {
    setCategory(value);
    setSizes(defaultSizes[value]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEdit) {
      toast({ title: "Log eerst in", description: "Je moet ingelogd zijn om producten op te slaan." });
      return;
    }
    if (!title.trim()) {
      toast({ title: "Product mist een naam", description: "Vul eerst een productnaam in." });
      return;
    }

    setSaving(true);
    try {
      let imageUrl = image.trim();
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }

      const created = await addProduct({
        title: title.trim(),
        brand,
        category,
        price: previewPrice,
        images: [imageUrl || fallbackImages[brand]],
        sizes: splitList(sizes),
        colors: splitList(colors),
        inStock: true,
        lowStock,
        description: description.trim() || "Premium item toegevoegd via het QualityFits admin panel.",
      });

      setTitle("");
      setImage("");
      setImageFile(null);
      setDescription("");
      setLowStock(false);
      toast({ title: "Product toegevoegd", description: `${created.title} staat nu in de shop.` });
    } catch (error) {
      toast({
        title: "Opslaan mislukt",
        description: error instanceof Error ? error.message : "Probeer het opnieuw.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (slug: string) => {
    try {
      await removeAdminProduct(slug);
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
        <div className="mb-10 border-b border-brand-ink/10 pb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-blue">Admin</p>
          <h1 className="font-anton text-5xl md:text-7xl uppercase mt-2 leading-none">Product toevoegen</h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-2xl">
            Voeg producten toe aan Nike, Essentials of ASICS. In productie worden producten en uploads opgeslagen in Supabase.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-8 border border-brand-blue/30 bg-white p-5 text-sm">
            Supabase env vars ontbreken. De admin werkt nu tijdelijk lokaal via deze browser. Voeg
            <code className="mx-1">VITE_SUPABASE_URL</code> en
            <code className="mx-1">VITE_SUPABASE_ANON_KEY</code> toe in Vercel om productie opslag te gebruiken.
          </div>
        )}

        {isSupabaseConfigured && !user && (
          <form onSubmit={handleLogin} className="mb-10 bg-brand-ink text-white p-6 md:p-8 max-w-xl space-y-4">
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
              className="inline-flex items-center gap-2 bg-brand-lime text-brand-ink font-bold uppercase tracking-[0.16em] px-7 py-4 disabled:opacity-60"
            >
              {authLoading && <Loader2 className="h-4 w-4 animate-spin" />} Inloggen
            </button>
          </form>
        )}

        {isSupabaseConfigured && user && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border border-brand-ink/10 bg-white p-4 text-sm">
            <span>Ingelogd als <strong>{user.email}</strong></span>
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

        <div className="grid lg:grid-cols-[1fr,380px] gap-10">
          <form onSubmit={handleSubmit} className="bg-white border border-brand-ink/10 p-6 md:p-8 space-y-5">
            <fieldset disabled={!canEdit || saving} className="space-y-5 disabled:opacity-55">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] font-bold mb-2 block">Productnaam</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nike Tech Hoodie"
                    className="w-full border border-border px-3 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] font-bold mb-2 block">Merkcategorie</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value as typeof brand)}
                    className="w-full border border-border bg-white px-3 py-3"
                  >
                    {brandOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] font-bold mb-2 block">Categorie</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as typeof category)}
                    className="w-full border border-border bg-white px-3 py-3"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] font-bold mb-2 block">Prijs</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    inputMode="decimal"
                    placeholder="99.95"
                    className="w-full border border-border px-3 py-3"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] font-bold mb-2 block">Afbeelding uploaden</label>
                  <label className="flex min-h-[48px] cursor-pointer items-center gap-3 border border-dashed border-brand-ink/25 px-3 py-3 text-sm hover:border-brand-blue">
                    <Upload className="h-4 w-4" />
                    <span>{imageFile ? imageFile.name : "Kies productfoto"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                      className="sr-only"
                    />
                  </label>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] font-bold mb-2 block">Of afbeelding URL</label>
                  <input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-border px-3 py-3"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] font-bold mb-2 block">Maten</label>
                  <input
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    className="w-full border border-border px-3 py-3"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] font-bold mb-2 block">Kleuren</label>
                  <input
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    className="w-full border border-border px-3 py-3"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.18em] font-bold mb-2 block">Beschrijving</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-border px-3 py-3"
                />
              </div>

              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={lowStock} onChange={(e) => setLowStock(e.target.checked)} />
                Markeer als lage voorraad
              </label>
            </fieldset>

            <button
              disabled={!canEdit || saving}
              className="inline-flex items-center gap-2 bg-brand-ink text-white font-bold uppercase tracking-[0.16em] px-7 py-4 hover:bg-brand-lime hover:text-brand-ink transition disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Product toevoegen
            </button>
          </form>

          <aside className="bg-brand-ink text-white p-6 md:p-8 h-fit">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-lime">Preview</p>
            <h2 className="font-anton text-3xl uppercase mt-3">{title || "Nieuw product"}</h2>
            <p className="mt-2 text-white/65">{brand} / {category}</p>
            <p className="mt-5 text-3xl font-bold">{formatPrice(previewPrice)}</p>
            <p className="mt-6 text-sm text-white/65">
              Dit product verschijnt direct in de collectie en in de merkcategorie {brand}.
            </p>
          </aside>
        </div>

        <section className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="font-anton text-3xl uppercase">Toegevoegde producten</h2>
            {adminProducts.length > 0 && (
              <button onClick={handleClear} className="text-sm underline underline-offset-4">
                Alles verwijderen
              </button>
            )}
          </div>

          {loading ? (
            <div className="border border-brand-ink/10 bg-white p-8 text-muted-foreground">
              Producten laden...
            </div>
          ) : adminProducts.length === 0 ? (
            <div className="border border-brand-ink/10 bg-white p-8 text-muted-foreground">
              Nog geen extra producten toegevoegd.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminProducts.map((product) => (
                <div key={product.slug} className="border border-brand-ink/10 bg-white p-4">
                  <img src={product.images[0]} alt={product.title} className="aspect-[4/3] w-full object-cover bg-brand-silver" />
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <Link to={`/products/${product.slug}`} className="font-semibold hover:underline">
                        {product.title}
                      </Link>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">
                        {product.brand} / {product.category}
                      </p>
                    </div>
                    <button
                      onClick={() => void handleRemove(product.slug)}
                      aria-label={`Verwijder ${product.title}`}
                      className="p-2 hover:text-destructive"
                      disabled={!canEdit}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
