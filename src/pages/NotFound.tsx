import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 font-anton text-6xl">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oeps! Pagina niet gevonden.</p>
        <a href="/" className="font-anton tracking-widest underline underline-offset-4 decoration-brand-lime">
          TERUG NAAR HOME
        </a>
      </div>
    </div>
  );
};

export default NotFound;
