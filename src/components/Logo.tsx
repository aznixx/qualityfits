import { Link } from "react-router-dom";
import logo from "@/assets/qualityfits-logo.png";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 group" aria-label="QualityFits">
      <span className="h-12 w-12 overflow-hidden">
        <img
          src={logo}
          alt=""
          className="h-full w-full object-contain"
        />
      </span>
      <span
        className={`font-anton text-xl sm:text-2xl tracking-wide uppercase leading-none hidden sm:inline ${
          light ? "text-white" : "text-white"
        }`}
      >
        Quality<span className="text-brand-lime">Fits</span>
      </span>
    </Link>
  );
}
