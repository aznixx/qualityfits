export type Category = {
  slug: string;
  name: string;
  image: string;
};

export const categories: Category[] = [
  {
    slug: "all-products",
    name: "Alle Items",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "nike",
    name: "Nike",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "essentials",
    name: "Essentials",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "asics",
    name: "ASICS",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "prada",
    name: "Prada",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "sneakers",
    name: "Sneakers",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "hoodies",
    name: "Hoodies",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "tracksuits",
    name: "Tracksuits",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "accessories",
    name: "Accessoires",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
  },
];

export const categoryNames: Record<string, string> = Object.fromEntries(
  categories.map((category) => [category.slug, category.name])
);
