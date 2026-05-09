import { Instagram, Search } from "lucide-react";
import { INSTAGRAM_URL, INSTAGRAM_USERNAME } from "@/lib/instagram";

export function RequestCountry() {
  return (
    <section className="bg-brand-lime text-brand-ink">
      <div className="container py-14 md:py-16 grid md:grid-cols-[1fr,auto] gap-8 items-center">
        <div className="flex items-start gap-5">
          <Search className="h-10 w-10 md:h-12 md:w-12 shrink-0 mt-1" />
          <div>
            <p className="uppercase tracking-[0.28em] text-xs mb-2">Zoek je iets specifieks?</p>
            <h2 className="font-anton text-4xl md:text-6xl uppercase leading-[0.86]">
              Stuur je item. Wij zoeken mee.
            </h2>
            <p className="mt-4 max-w-xl text-sm md:text-base">
              DM je maat, item of colorway. Voor nu focussen we op Nike, Essentials en ASICS.
            </p>
          </div>
        </div>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-brand-ink text-white font-bold uppercase tracking-[0.16em] text-sm px-7 py-4 hover:bg-white hover:text-brand-ink transition whitespace-nowrap"
        >
          <Instagram className="h-5 w-5" /> DM @{INSTAGRAM_USERNAME.toUpperCase()}
        </a>
      </div>
    </section>
  );
}
