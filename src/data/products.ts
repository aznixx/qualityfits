export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  price: number; // cents
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  lowStock: boolean;
  description: string;
};

const clothingSizes = ["XS", "S", "M", "L", "XL"];
const shoeSizes = ["39", "40", "41", "42", "43", "44", "45"];

export const products: Product[] = [
  {
    id: "essentials-core-hoodie",
    slug: "essentials-core-hoodie",
    title: "Essentials Core Hoodie",
    brand: "Essentials",
    category: "hoodies",
    price: 8995,
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85",
    ],
    sizes: clothingSizes,
    colors: ["Zand", "Zwart", "Charcoal"],
    inStock: true,
    lowStock: true,
    description:
      "Zware hoodie met relaxte premium fit, zachte fleece binnenkant en een cleane dagelijkse look.",
  },
  {
    id: "nike-tech-fleece-set",
    slug: "nike-tech-fleece-set",
    title: "Nike Tech Fleece Set",
    brand: "Nike",
    category: "accessories",
    price: 14995,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85",
    ],
    sizes: clothingSizes,
    colors: ["Zwart", "Grijs", "Navy"],
    inStock: true,
    lowStock: false,
    description:
      "Gestroomlijnde fleece set met stevige feel, tapered fit en makkelijk te stylen voor elke dag.",
  },
  {
    id: "asics-gel-kayano-14",
    slug: "asics-gel-kayano-14",
    title: "ASICS Gel-Kayano 14",
    brand: "ASICS",
    category: "sneakers",
    price: 15995,
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=85",
    ],
    sizes: shoeSizes,
    colors: ["Zilver", "Cream", "Graphite"],
    inStock: true,
    lowStock: true,
    description:
      "Metallic runner met mesh details, comfortabele demping en een technische Y2K uitstraling.",
  },
  {
    id: "nike-club-jogger",
    slug: "nike-club-jogger",
    title: "Nike Club Jogger",
    brand: "Nike",
    category: "tracksuits",
    price: 6495,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    ],
    sizes: clothingSizes,
    colors: ["Zwart", "Grijs", "Olive"],
    inStock: true,
    lowStock: false,
    description:
      "Zachte fleece jogger met tapered pijp, elastische cuffs en een cleane fit voor dagelijks gebruik.",
  },
  {
    id: "prada-nylon-crossbody",
    slug: "prada-nylon-crossbody",
    title: "Prada Nylon Crossbody",
    brand: "Prada",
    category: "tracksuits",
    price: 24995,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    ],
    sizes: ["OS"],
    colors: ["Zwart"],
    inStock: true,
    lowStock: false,
    description:
      "Premium Prada item voor een cleane high-end finish bij dagelijkse outfits.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const getProductsByCategory = (slug: string) =>
  slug === "all-products"
    ? products
    : ["nike", "essentials", "asics", "prada"].includes(slug)
      ? products.filter((p) => p.brand.toLowerCase() === (slug === "asics" ? "asics" : slug))
      : products.filter((p) => p.category === slug);

export const getRelated = (slug: string, category: string) =>
  products.filter((p) => p.slug !== slug && p.category === category).slice(0, 4);

export const bestSellers = () => products;
