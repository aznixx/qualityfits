import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { count, openDrawer, bump } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [animateBubble, setAnimateBubble] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    if (bump === 0) return;
    setAnimateBubble(true);
    const t = setTimeout(() => setAnimateBubble(false), 400);
    return () => clearTimeout(t);
  }, [bump]);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/collections/all-products", label: "Shop" },
    { to: "/track-order", label: "Bestelling Volgen" },
    { to: "/contact", label: "Contact" },
  ];

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "px-4 py-2 text-white/70 transition hover:text-white",
      isActive && "bg-white text-brand-ink hover:text-brand-ink"
    );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-ink/90 text-white backdrop-blur-xl">
      <div className="container flex min-h-20 items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em]">
            <NavLink to="/" end className={navClass}>Home</NavLink>
            <NavLink to="/collections/all-products" className={navClass}>Shop</NavLink>
            <NavLink to="/track-order" className={navClass}>Bestelling Volgen</NavLink>
            <NavLink to="/contact" className={navClass}>Contact</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button aria-label="Search" className="p-2 text-white/80 hover:text-brand-lime hidden sm:inline-flex">
            <Search className="h-5 w-5" />
          </button>
          <button
            aria-label="Cart"
            onClick={openDrawer}
            className="relative p-2 text-white/80 hover:text-brand-lime"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span
                className={cn(
                  "absolute -top-0.5 -right-0.5 bg-brand-lime text-brand-ink text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center transition-transform",
                  animateBubble && "scale-125"
                )}
              >
                {count}
              </span>
            )}
          </button>
          <button
            aria-label="Menu"
            className="lg:hidden p-2 text-white/80"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-brand-ink text-white animate-fade-in lg:hidden">
          <div className="container flex h-16 items-center justify-between border-b border-white/10">
            <Logo />
            <button aria-label="Close" onClick={() => setMobileOpen(false)} className="p-2 text-white/80">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="container py-6 flex flex-col gap-1">
            {navItems.map((n) => (
              <Link key={n.to} to={n.to} className="font-anton text-2xl py-4 border-b border-white/10">
                {n.label.toUpperCase()}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
