import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Collection from "./pages/Collection.tsx";
import ProductPage from "./pages/Product.tsx";
import Cart from "./pages/Cart.tsx";
import Contact from "./pages/Contact.tsx";
import TrackOrder from "./pages/TrackOrder.tsx";
import Admin from "./pages/Admin.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { ProductProvider } from "./context/ProductContext.tsx";
import { Layout } from "./components/Layout.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ProductProvider>
          <CartProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/collections/:slug" element={<Collection />} />
                <Route path="/products/:slug" element={<ProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/admin" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </CartProvider>
        </ProductProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
