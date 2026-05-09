# QualityFits deployment

## Supabase

1. Maak een Supabase project aan.
2. Open de SQL editor en run `supabase-products.sql`.
3. Maak in Supabase Authentication een admin user aan met email en wachtwoord.
4. Zet publieke signups uit of beperk ze, zodat niet iedereen een admin account kan maken.

Gebruik alleen de anon public key in de frontend. Gebruik nooit de service role key in Vercel of in browsercode.

## Vercel environment variables

Zet deze variables in Vercel bij Project Settings > Environment Variables:

```txt
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-publishable-key
VITE_SUPABASE_PRODUCT_BUCKET=product-images
```

Daarna opnieuw deployen. Het admin panel staat op `/admin`.

## Product uploads

In `/admin` kun je een productfoto uploaden of een image URL gebruiken. Uploads gaan naar de Supabase storage bucket `product-images`.
