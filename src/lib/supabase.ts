import { createClient } from "@supabase/supabase-js";

export type ProductRow = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  low_stock: boolean;
  description: string;
  created_at?: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
) as string | undefined;

export const productImageBucket =
  (import.meta.env.VITE_SUPABASE_PRODUCT_BUCKET as string | undefined) || "product-images";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;
