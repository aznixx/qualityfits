import { useState } from "react";

export default function TrackOrder() {
  const [submitted, setSubmitted] = useState<{ order: string } | null>(null);

  return (
    <div className="container py-16 max-w-xl">
      <h1 className="font-anton text-4xl md:text-5xl uppercase">Volg je bestelling</h1>
      <p className="mt-3 text-muted-foreground">
        Vul je bestelnummer en het e-mailadres in dat je bij de bestelling hebt gebruikt.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.target as HTMLFormElement);
          setSubmitted({ order: String(fd.get("order") || "") });
        }}
        className="mt-8 space-y-4"
      >
        <div>
          <label className="text-xs uppercase tracking-widest mb-1 block">Bestelnummer</label>
          <input name="order" required className="w-full border border-border px-3 py-3" placeholder="QF-123456" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest mb-1 block">Email</label>
          <input name="email" type="email" required className="w-full border border-border px-3 py-3" />
        </div>
        <button className="w-full bg-brand-ink text-white font-bold uppercase tracking-[0.18em] py-4 hover:bg-brand-lime hover:text-brand-ink">
          VOLG BESTELLING
        </button>
      </form>

      {submitted && (
        <div className="mt-8 border border-border p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Bestelling</p>
          <p className="font-anton text-2xl mt-1">{submitted.order}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Live tracking wordt hier weergegeven. Heb je via Instagram besteld? Stuur ons een DM voor een directe update.
          </p>
        </div>
      )}
    </div>
  );
}
