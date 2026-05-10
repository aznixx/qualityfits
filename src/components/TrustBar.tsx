import { RotateCcw, Shirt, Sparkles, Truck } from "lucide-react";

const items = [
  { icon: Sparkles, label: "Geselecteerde Items", note: "Premium selectie" },
  { icon: Truck, label: "Snelle Verzending", note: "Snel verwerkt" },
  { icon: RotateCcw, label: "Makkelijk Retour", note: "Niet tevreden? Geld terug" },
  { icon: Shirt, label: "Premium Merken", note: "Nike, Essentials, ASICS en Prada" },
];

export function TrustBar() {
  return (
    <section className="border-y border-brand-ink/10 bg-white">
      <div className="container grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-brand-ink/10">
        {items.map(({ icon: Icon, label, note }) => (
          <div key={label} className="py-8 md:py-10 px-4">
            <Icon className="h-6 w-6 text-brand-blue" />
            <p className="mt-4 font-bold uppercase tracking-[0.16em] text-xs">{label}</p>
            <p className="mt-2 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
