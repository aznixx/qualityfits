import { Instagram, Search } from "lucide-react";
import { INSTAGRAM_URL, INSTAGRAM_USERNAME } from "@/lib/instagram";

export function RequestCountry() {
  return (
    <section className="bg-brand-lime text-brand-ink">
      <div className="container grid gap-8 py-12 text-center md:grid-cols-[1fr,auto] md:items-center md:py-16 md:text-left">
        <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
          <Search className="mt-1 h-10 w-10 shrink-0 md:h-12 md:w-12" />
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.24em] md:tracking-[0.28em]">Zoek je iets specifieks?</p>
            <h2 className="font-anton text-4xl uppercase leading-[0.95] md:text-6xl md:leading-[0.86]">
              Stuur je item. Wij zoeken mee.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm md:mx-0 md:text-base">
              DM je maat, item of colorway. Voor nu focussen we op Nike, Essentials, ASICS en Prada.
            </p>
          </div>
        </div>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-14 items-center justify-center gap-2 bg-brand-ink px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-brand-ink sm:px-7 sm:tracking-[0.16em]"
        >
          <Instagram className="h-5 w-5" /> DM @{INSTAGRAM_USERNAME.toUpperCase()}
        </a>
      </div>
    </section>
  );
}
