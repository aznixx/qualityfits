import { Link } from "react-router-dom";
import { ProductGrid } from "@/components/ProductGrid";
import { TrustBar } from "@/components/TrustBar";
import { RequestCountry } from "@/components/RequestCountry";
import { useProducts } from "@/context/ProductContext";
import poster from "@/assets/qualityfits-poster.png";
import logo from "@/assets/qualityfits-logo.png";
import { INSTAGRAM_URL } from "@/lib/instagram";
import { SNAPCHAT_URL } from "@/lib/snapchat";
import { ArrowRight, Ghost, Instagram, Sparkles, Star } from "lucide-react";

const brands = ["Essentials", "Nike", "ASICS", "Prada"];

const Index = () => {
  const { bestSellers } = useProducts();

  return (
    <>
      <section className="relative overflow-hidden bg-brand-ink text-white lg:min-h-[calc(100vh-80px)]">
        <div className="absolute inset-0 qf-noise" />
        <div className="absolute inset-0 qf-grid opacity-[0.08]" />

        <div className="relative grid lg:min-h-[calc(100vh-80px)] lg:grid-cols-[minmax(0,0.9fr),minmax(460px,1.1fr)]">
          <div className="flex flex-col justify-between px-5 py-7 sm:px-8 md:py-10 lg:pl-14 lg:pr-10 xl:pl-20">
            <div className="flex items-center justify-center gap-4 text-center text-[10px] uppercase tracking-[0.2em] text-white/55 sm:justify-between sm:text-left sm:text-[11px] sm:tracking-[0.24em]">
              <span>Drop 01 / Nieuwe collectie</span>
              <span className="hidden sm:inline">Alleen echte merken</span>
            </div>

            <div className="py-10 text-center sm:py-12 lg:text-left">
              <img
                src={logo}
                alt="QualityFits"
                className="mx-auto mb-8 w-[min(78vw,360px)] max-w-full object-contain object-center sm:w-[min(70vw,420px)]"
              />
              <div className="relative grid items-end justify-items-center lg:justify-items-start">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.32em] text-brand-lime sm:tracking-[0.38em]">
                  Premium brands / quality fits
                </p>
                <h1 className="relative z-10 max-w-[760px] font-anton text-[clamp(3.6rem,17vw,7.5rem)] uppercase leading-[0.98] sm:leading-[0.96]">
                  <span className="block">Bouw</span>
                  <span className="block">jouw</span>
                  <span className="block">fit.</span>
                </h1>
                <div className="mt-5 h-2.5 w-[min(72vw,520px)] bg-brand-lime/95 sm:h-3" />
              </div>

              <div className="mt-9 grid gap-3 sm:mt-12 sm:flex sm:flex-wrap sm:justify-center lg:justify-start">
                <Link
                  to="/collections/all-products"
                  className="inline-flex min-h-14 items-center justify-center gap-3 bg-brand-lime px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-brand-ink transition hover:bg-white sm:px-7 sm:tracking-[0.18em]"
                >
                  Shop de drop <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-3 border border-white/25 px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:border-brand-lime hover:text-brand-lime sm:px-7 sm:tracking-[0.18em]"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
                <a
                  href={SNAPCHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-3 border border-white/25 px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:border-brand-lime hover:text-brand-lime sm:px-7 sm:tracking-[0.18em]"
                >
                  <Ghost className="h-4 w-4" /> Snapchat
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 border-y border-white/15 text-white">
              {[
                ["4", "Merken"],
                ["24u", "Reactietijd"],
                ["NL", "Snelle verzending"],
              ].map(([value, label]) => (
                <div key={label} className="border-r border-white/15 px-2 py-4 text-center last:border-r-0 sm:px-4 sm:py-5">
                  <p className="font-anton text-4xl text-brand-lime sm:text-5xl md:text-6xl">{value}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/60 sm:text-[10px] sm:tracking-[0.22em]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[440px] border-t border-white/10 px-5 pb-12 pt-8 sm:min-h-[520px] sm:px-10 lg:min-h-0 lg:border-l lg:border-t-0 lg:px-10 lg:py-12">
            <div className="absolute right-4 top-8 hidden h-[calc(100%-4rem)] flex-col items-center justify-between text-[10px] font-bold uppercase tracking-[0.28em] text-white/35 lg:flex">
              {brands.map((brand) => (
                <span key={brand} className="[writing-mode:vertical-rl]">{brand}</span>
              ))}
            </div>

            <div className="relative mx-auto flex h-full min-h-[390px] max-w-[620px] items-center justify-center sm:min-h-[480px]">
              <div className="absolute left-6 top-8 h-[78%] w-[72%] rotate-[-8deg] border border-white/10 bg-white/5 sm:left-4 sm:top-12 sm:rotate-[-10deg]" />
              <div className="absolute bottom-8 right-6 h-[76%] w-[76%] rotate-[6deg] border border-brand-lime/25 bg-brand-lime/5 sm:right-8 sm:bottom-10 sm:rotate-[8deg]" />
              <div className="absolute bottom-12 left-0 z-20 border border-white/15 bg-brand-ink/90 px-4 py-3 backdrop-blur sm:-left-2 sm:bottom-20 sm:px-5 sm:py-4">
                <p className="font-anton text-3xl leading-none text-brand-lime sm:text-4xl">4</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">merken</p>
              </div>
              <Link
                to="/collections/all-products"
                className="group relative z-10 block w-[min(76vw,430px)] rotate-[3deg] overflow-hidden border border-white/20 bg-brand-ink shadow-2xl shadow-black/50 transition duration-300 hover:rotate-[2deg] hover:scale-[1.02] sm:w-[min(82vw,460px)] sm:rotate-[4deg]"
              >
                <img
                  src={poster}
                  alt="QualityFits poster met premium merken"
                  className="aspect-[4/5] w-full object-cover opacity-95 transition duration-300 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/45 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/55">Merken van nu</p>
                  <p className="mt-2 font-anton text-3xl uppercase leading-none">Essentials / Nike / ASICS / Prada</p>
                </div>
              </Link>
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
              Geen eindeloze catalogus. Alleen een scherpe selectie van Nike, Essentials, ASICS en Prada.
            </p>
          </div>
          <ProductGrid products={bestSellers()} />
        </div>
      </section>

      <TrustBar />

      <section className="bg-brand-graphite text-white">
        <div className="container py-16 md:py-24 grid lg:grid-cols-[1.05fr,0.95fr] gap-12 items-center">
          <div className="relative mx-auto w-full max-w-[440px] py-8 lg:py-14">
            <div className="absolute left-4 top-12 h-[78%] w-[78%] rotate-[-8deg] border border-white/10 bg-white/5" />
            <div className="absolute right-6 bottom-12 h-[72%] w-[72%] rotate-[7deg] border border-brand-lime/25 bg-brand-lime/5" />
            <Link
              to="/collections/all-products"
              className="group relative block rotate-[-4deg] overflow-hidden border border-white/20 bg-brand-ink shadow-2xl shadow-black/45 transition duration-300 hover:rotate-[-2deg] hover:scale-[1.02]"
            >
              <img
                src={poster}
                alt="QualityFits poster met Essentials, Nike, ASICS en Prada"
                className="aspect-[4/5] w-full object-cover opacity-95 transition duration-300 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/35 via-transparent to-transparent" />
            </Link>
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
                { icon: Star, label: "Geselecteerde items" },
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-ink/15">
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
