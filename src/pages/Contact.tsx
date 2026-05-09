import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { INSTAGRAM_USERNAME } from "@/lib/instagram";

export default function Contact() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast({ title: "Bericht verzonden", description: "We reageren binnen 24 uur." });
    }, 600);
  };

  return (
    <div className="container py-16 max-w-xl">
      <h1 className="font-anton text-4xl md:text-5xl uppercase">Neem contact op</h1>
      <p className="mt-3 text-muted-foreground">
        Vragen over maten, voorraad, merken of je bestelling? Stuur ons een bericht.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest mb-1 block">Naam</label>
          <input required className="w-full border border-border px-3 py-3" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest mb-1 block">Email</label>
          <input required type="email" className="w-full border border-border px-3 py-3" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest mb-1 block">Onderwerp</label>
          <select className="w-full border border-border px-3 py-3 bg-white">
            <option>Vraag over bestelling</option>
            <option>Voorraad of maat</option>
            <option>Brand request</option>
            <option>Retour</option>
            <option>Anders</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest mb-1 block">Bericht</label>
          <textarea required rows={5} className="w-full border border-border px-3 py-3" />
        </div>
        <button
          disabled={sending}
          className="w-full bg-brand-ink text-white font-bold uppercase tracking-[0.18em] py-4 hover:bg-brand-lime hover:text-brand-ink disabled:opacity-60"
        >
          {sending ? "VERZENDEN..." : "VERSTUUR BERICHT"}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-border text-sm text-muted-foreground">
        <p>Email: <a href="mailto:hello@qualityfits.nl" className="text-foreground hover:underline">hello@qualityfits.nl</a></p>
        <p className="mt-1">We reageren binnen 24 uur.</p>
        <p className="mt-1">Of stuur ons direct een DM op <span className="text-foreground">@{INSTAGRAM_USERNAME}</span>.</p>
      </div>
    </div>
  );
}
