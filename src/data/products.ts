export type Product = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  notes: string[];
  includes: string[];
  details: string[];
  price: number;
  compareAt?: number;
  variantId: string;
  images: string[];
  featured: boolean;
  category: string;
};

export const SHOPIFY_STORE = "https://maisonindira.myshopify.com";

export const brand = {
  name: "Maison Indira",
  tagline: "Not just fragrance. An experience.",
  phone: "(732) 397-3299",
  phoneHref: "tel:+17323973299",
  email: "MaisonIndira9@gmail.com",
  instagram: "MaisonIndira_",
  instagramUrl: "https://www.instagram.com/maisonindira_/",
};

export const products: Product[] = [
  {
    slug: "cloud-nine-oil",
    name: "Cloud Nine Home Fragrance Oil",
    shortName: "Fragrance Oil",
    tagline: "The signature scent, in a 1 oz dropper.",
    description:
      "Transform a room into a calm sanctuary. Cloud Nine blends soft vanilla, warm musk, and delicate lavender into a scent that feels cozy, elegant, and quietly unforgettable. Use it with a reed diffuser or as part of a slower evening ritual. Housed in a 1 oz glass dropper bottle with rose-gold detailing.",
    notes: ["Soft vanilla", "Warm musk", "Lavender"],
    includes: ["1 oz glass dropper bottle", "Rose-gold detailing"],
    details: [
      "1 fl oz / 30 ml",
      "Luxury home fragrance oil",
      "Made for reed diffusers",
      "Handcrafted with care",
    ],
    price: 15,
    compareAt: 20,
    variantId: "49432918884594",
    images: [
      "/images/oil-2.png",
      "/images/oil-1.jpg",
      "/images/oil-3.jpg",
      "/images/oil-4.jpg",
    ],
    featured: true,
    category: "Oil",
  },
  {
    slug: "cloud-nine-diffuser",
    name: "Cloud Nine Modern Reed Diffuser",
    shortName: "Reed Diffuser Set",
    tagline: "Scent and object, equally considered.",
    description:
      "A minimalist ceramic vessel that doubles as décor while filling a room with Cloud Nine. Designed for bedrooms, bathrooms, offices, and entryways — and for gifting. The set arrives ready: vessel, reeds, and the signature oil.",
    notes: ["Soft vanilla", "Warm musk", "Lavender"],
    includes: [
      "Modern ceramic diffuser vessel",
      "Reed sticks",
      "Cloud Nine home fragrance oil",
    ],
    details: [
      "White ceramic vessel",
      "Signature Cloud Nine oil included",
      "Handcrafted with care",
    ],
    price: 40,
    compareAt: 48,
    variantId: "49473794703602",
    images: [
      "/images/diffuser-1.jpg",
      "/images/diffuser-2.jpg",
      "/images/diffuser-3.jpg",
      "/images/diffuser-4.jpg",
      "/images/diffuser-5.jpg",
      "/images/diffuser-6.jpg",
    ],
    featured: true,
    category: "Diffuser",
  },
  {
    slug: "boutique-gift-set",
    name: "Boutique Luxury Diffuser Gift Set",
    shortName: "Gift Set",
    tagline: "Ready to wrap. Ready to scent a room.",
    description:
      "A spa-like set for the person who notices the atmosphere of a house. Modern reed diffuser, 1 oz Cloud Nine oil, and reeds — brand new in the original box, finished in a gift bag.",
    notes: ["Soft vanilla", "Warm musk", "Lavender"],
    includes: [
      "Modern reed diffuser",
      "1 oz Cloud Nine fragrance oil",
      "Reed sticks",
      "Original box and gift bag",
    ],
    details: [
      "Current scent: Cloud Nine",
      "Ready to gift",
      "For bedrooms, bathrooms, offices, and housewarmings",
    ],
    price: 25,
    compareAt: 30,
    variantId: "49246438392050",
    images: [
      "/images/gift-2.png",
      "/images/gift-3.jpg",
      "/images/gift-4.png",
      "/images/gift-1.jpg",
    ],
    featured: true,
    category: "Gift",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function checkoutUrl(
  lines: { variantId: string; qty: number }[],
  store = SHOPIFY_STORE,
): string {
  const path = lines
    .filter((line) => line.qty > 0)
    .map((line) => `${line.variantId}:${line.qty}`)
    .join(",");
  if (!path) return `${store}/cart`;
  return `${store}/cart/${path}`;
}
