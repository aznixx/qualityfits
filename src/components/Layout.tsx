import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main key={pathname} className="flex-1 animate-fade-in">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}