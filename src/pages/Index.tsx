import { Link } from "react-router-dom";
import { ProductGrid } from "@/components/ProductGrid";
import { TrustBar } from "@/components/TrustBar";
import { RequestCountry } from "@/components/RequestCountry";
import { useProducts } from "@/context/ProductContext";
import poster from "@/assets/qualityfits-poster.png";
import logo from "@/assets/qualityfits-logo.png";
import { INSTAGRAM_URL } from "@/lib/instagram";
import { SNAPCHAT_URL } from "@/lib/snapchat";
import { ArrowRight, Ghost, Instagram, ShieldCheck, Sparkles } from "lucide-react";

const brands = ["Essentials", "Nike", "ASICS"];

const Index = () => {
  const { products, bestSellers } = useProducts();
  const featured = products.slice(0, 3);

  return (
    <>
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-brand-ink text-white">
        <div className="absolute inset-0 qf-noise" />
        <div className="absolute inset-0 qf-grid opacity-[0.08]" />

        <div className="relative grid min-h-[calc(100vh-80px)] lg:grid-cols-[minmax(0,0.95fr),minmax(420px,1.05fr)]">
          <div className="px-6 sm:px-10 lg:pl-14 xl:pl-20 lg:pr-10 py-8 md:py-12 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-6 text-[11px] uppercase tracking-[0.24em] text-white/55">
              <span>Drop 01 / Nieuwe collectie</span>
              <span className="hidden sm:inline">Alleen echte merken</span>
            </div>

            <div className="py-14 md:py-20">
              <img
                src={logo}
                alt="QualityFits"
                className="mx-auto mb-10 w-[min(72vw,460px)] max-w-full object-contain object-center"
              />
              <div className="grid items-end">
                <h1 className="font-anton text-[clamp(3.8rem,7.8vw,7.6rem)] leading-[0.98] uppercase max-w-[720px]">
                  <span className="block">Bouw</span>
                  <span className="block">jouw</span>
                  <span className="block">fit.</span>
                </h1>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/collections/all-products"
                  className="inline-flex items-center gap-3 bg-brand-lime px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-ink hover:bg-white transition"
                >
                  Shop de drop <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 border border-white/25 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white hover:border-brand-lime hover:text-brand-lime transition"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
                <a
                  href={SNAPCHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 border border-white/25 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white hover:border-brand-lime hover:text-brand-lime transition"
                >
                  <Ghost className="h-4 w-4" /> Snapchat
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 border-y border-white/15 text-white">
              {[
                ["100%", "Authentiek"],
                ["24u", "Reactietijd"],
                ["NL", "Snelle verzending"],
              ].map(([value, label]) => (
                <div key={label} className="py-5 px-4 border-r border-white/15 last:border-r-0 text-center">
                  <p className="font-anton text-4xl md:text-6xl text-brand-lime">{value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative border-l border-white/10">
            <div className="absolute inset-8 xl:inset-12 overflow-hidden border border-white/12 bg-white/5">
              <img
                src={poster}
                alt="QualityFits poster met premium merken"
                className="h-full w-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Merken van nu</p>
                <p className="mt-3 font-anton text-5xl uppercase leading-none">Essentials / Nike / ASICS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-brand-ink/10">
        <div className="marquee py-5 font-bold tracking-[0.18em] text-xs uppercase text-brand-graphite">
          {[0, 1].map((k) => (
            <div key={k} className="marquee-track" aria-hidden={k === 1}>
              {brands.map((brand) => (
                <span key={brand} className="flex items-center gap-10 whitespace-nowrap">
                  <span>{brand}</span>
                  <span className="text-brand-blue">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="qf-grid bg-brand-frost">
        <div className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-[0.82fr,1.18fr] gap-10 items-end mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-brand-blue mb-3">Nieuwe selectie</p>
              <h2 className="font-anton text-5xl md:text-7xl uppercase leading-[0.86]">
                Items die je fit maken.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xl lg:justify-self-end">
              Geen eindeloze catalogus. Alleen een scherpe selectie van Nike, Essentials en ASICS.
            </p>
          </div>
          <ProductGrid products={bestSellers()} />
        </div>
      </section>

      <TrustBar />

      <section className="bg-brand-graphite text-white">
        <div className="container py-16 md:py-24 grid lg:grid-cols-[1.05fr,0.95fr] gap-12 items-center">
          <div className="grid grid-cols-3 gap-3">
            {featured.map((product, index) => (
              <Link
                key={product.slug}
                to={`/products/${product.slug}`}
                className={`group block overflow-hidden border border-white/10 bg-white/5 ${index === 1 ? "mt-10" : ""}`}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="aspect-[3/4] h-full w-full object-cover opacity-90 transition group-hover:scale-105"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
          <div>
            <p className="uppercase tracking-[0.28em] text-xs text-brand-lime mb-4">Kwaliteitscheck</p>
            <h2 className="font-anton text-5xl md:text-7xl uppercase leading-[0.86]">
              Alleen de beste items halen de site.
            </h2>
            <p className="mt-6 text-white/70 max-w-md">
              QualityFits houdt het bewust klein: minder keuzes, betere picks en makkelijkere outfits.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, label: "Authentieke items" },
                { icon: Sparkles, label: "Strakke daily fits" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="border border-white/10 p-5">
                  <Icon className="h-5 w-5 text-brand-lime" />
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em]">{label}</p>
                </div>
              ))}
            </div>
            <Link
              to="/collections/all-products"
              className="mt-8 inline-flex items-center gap-3 bg-white px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-ink hover:bg-brand-lime transition"
            >
              Bekijk collectie <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <RequestCountry />

      <section className="container py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-brand-blue mb-3">Merken</p>
            <h2 className="font-anton text-4xl md:text-6xl uppercase leading-none">Shop per merk.</h2>
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] hover:text-brand-blue">
            Volg @qualityfits.official <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-brand-ink/15">
          {brands.map((brand) => (
            <Link
              key={brand}
              to={`/collections/${brand.toLowerCase()}`}
              className="bg-white p-8 min-h-44 flex flex-col justify-between hover:bg-brand-lime transition"
            >
              <p className="font-anton text-4xl uppercase leading-none">{brand}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-graphite/70">Bekijk items</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Index;
