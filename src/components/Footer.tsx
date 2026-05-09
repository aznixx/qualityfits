import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Instagram, Mail } from "lucide-react";
import { INSTAGRAM_URL } from "@/lib/instagram";

export function Footer() {
  return (
    <footer className="bg-brand-ink text-white mt-16">
      <div className="container py-16 grid gap-12 md:grid-cols-[1.25fr,0.8fr,0.8fr,0.9fr]">
        <div>
          <Logo light />
          <p className="mt-5 text-sm text-white/62 max-w-xs">
            QualityFits selecteert Nike, Essentials en ASICS voor cleane dagelijkse fits.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.18em] mb-5 text-brand-lime">Shop</h4>
          <ul className="space-y-3 text-sm text-white/65">
            <li><Link to="/collections/all-products" className="hover:text-brand-lime">Alle Items</Link></li>
            <li><Link to="/collections/sneakers" className="hover:text-brand-lime">Sneakers</Link></li>
            <li><Link to="/collections/hoodies" className="hover:text-brand-lime">Hoodies</Link></li>
            <li><Link to="/collections/tracksuits" className="hover:text-brand-lime">Tracksuits</Link></li>
            <li><Link to="/track-order" className="hover:text-brand-lime">Bestelling volgen</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.18em] mb-5 text-brand-lime">Help</h4>
          <ul className="space-y-3 text-sm text-white/65">
            <li><Link to="/contact" className="hover:text-brand-lime">Contact</Link></li>
            <li><a href="mailto:hello@qualityfits.nl" className="hover:text-brand-lime">hello@qualityfits.nl</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.18em] mb-5 text-brand-lime">Volg ons</h4>
          <div className="flex gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className="p-3 border border-white/15 hover:border-brand-lime hover:text-brand-lime"><Instagram className="h-4 w-4" /></a>
            <a href="mailto:hello@qualityfits.nl" aria-label="Email" className="p-3 border border-white/15 hover:border-brand-lime hover:text-brand-lime"><Mail className="h-4 w-4" /></a>
          </div>
          <p className="mt-5 text-xs text-white/55">Bestel of vraag items aan via Instagram DM.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} QualityFits. Alle rechten voorbehouden.</p>
          <p className="tracking-[0.18em] uppercase">Premium merken / Quality fits</p>
        </div>
      </div>
    </footer>
  );
}
