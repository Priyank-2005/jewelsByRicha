import { CATEGORIES, type Tone } from "./catalog";
import { slugify } from "@/lib/utils";
import { POOLS } from "./images";

export type ProductBadge = "NEW" | "BEST SELLER" | "SALE" | "LIMITED";

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  collectionId: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  /** Real photos (URLs). When empty, the storefront draws an illustrated placeholder. */
  images: string[];
  tone: Tone;
  rating: number;
  reviewCount: number;
  badge?: ProductBadge;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  stock: number;
  status: "ACTIVE" | "DRAFT";
  features: string[];
  material: string;
  careInstructions: string;
  createdAt: string;
}

// categoryId -> [base price, three product names]
const SEED: Record<string, [number, string[]]> = {
  "cat-f1": [1799, ["Kashmir Rose Watch", "Chinar Gold Watch", "Dal Lake Pearl Watch"]],
  "cat-f2": [1499, ["Maharani Layered Necklace", "Rajwada Choker", "Noor Kundan Necklace"]],
  "cat-f3": [1299, ["Virasat Heritage Kada", "Meenakari Gold Kada", "Rajputana Carved Kada"]],
  "cat-f4": [1599, ["Aarohi Pendant Set", "Devika Pearl Pendant Set", "Tara Drop Pendant Set"]],
  "cat-f5": [1399, ["Zircon Royale AD Kada", "Diamante Twin Kada", "Starlight AD Kada"]],
  "cat-f6": [899, ["Kashmiri Chandbali", "Gulmarg Jhumka", "Shalimar Filigree Drops"]],
  "cat-f7": [1999, ["Solitaire Moissanite Studs", "Halo Moissanite Studs", "Teardrop Moissanite Drops"]],
  "cat-f8": [999, ["Shimmer Festive Bracelet", "Pearl Cluster Bracelet", "Lotus Charm Bracelet"]],
  "cat-f9": [599, ["Rani Pearl Studs", "Floral AD Studs", "Crescent Gold Studs"]],
  "cat-a1": [999, ["Classic Black Bead Mangalsutra", "Diamond Tip Mangalsutra", "Minimal Gold Mangalsutra"]],
  "cat-a2": [699, ["Sleek Gold Kada", "Twisted Rope Kada", "Open Cuff Kada"]],
  "cat-a3": [499, ["Paperclip Chain Bracelet", "Cuban Link Bracelet", "Tennis Chain Bracelet"]],
  "cat-a4": [399, ["Dainty Solitaire Ring", "Twin Band Ring", "Adjustable Leaf Ring"]],
  "cat-a5": [449, ["Everyday Gold Hoops", "Chunky Twist Hoops", "Mini Huggie Hoops"]],
  "cat-a6": [549, ["Pearl Drop Danglers", "Star Charm Danglers", "Tassel Danglers"]],
  "cat-a7": [349, ["Pearl Studs", "Tiny Zircon Studs", "Heart Studs"]],
  "cat-a8": [599, ["Snake Chain Necklace", "Box Chain Necklace", "Rope Chain Necklace"]],
  "cat-a9": [999, ["Layered Trio Necklace Pack", "Pearl & Chain Combo Pack", "Pendant Duo Combo Pack"]],
  "cat-a10": [1299, ["Slim Gold Watch", "Onyx Dial Watch", "Pearl Face Watch"]],
};

const TONES: Tone[] = ["gold", "rose", "onyx", "pearl"];
const FESTIVE_FEATURES = ["American diamond finish", "Handcrafted detailing", "Gift-ready box", "Skin friendly"];
const AT_FEATURES = ["Anti-tarnish", "Waterproof", "Skin friendly", "Lightweight"];
const BADGES: (ProductBadge | undefined)[] = ["BEST SELLER", undefined, "NEW", undefined, "SALE", undefined, "LIMITED"];

function pad(n: number) {
  return n < 10 ? "0" + n : String(n);
}

let counter = 0;
export const PRODUCTS: Product[] = CATEGORIES.flatMap((cat) => {
  const [base, names] = SEED[cat.id];
  const festive = cat.collectionId === "col-festive";
  const pool = POOLS[cat.kind];
  const off = CATEGORIES.filter((c, idx) => idx < CATEGORIES.indexOf(cat) && c.kind === cat.kind).length * 3;
  return names.map((name, i) => {
    counter += 1;
    const price = base + i * (festive ? 150 : 100) - (i === 2 ? 50 : 0);
    const onSale = (counter + i) % 4 === 0;
    const originalPrice = onSale || i === 0 ? Math.round((price * 1.4) / 10) * 10 - 1 : undefined;
    const badge = BADGES[counter % BADGES.length];
    return {
      id: `p${counter}`,
      name,
      slug: slugify(name),
      categoryId: cat.id,
      collectionId: cat.collectionId,
      price,
      originalPrice,
      description: festive
        ? `${name} is made for the moments you dress up for. Finished in a rich gold tone with fine detailing, it pairs beautifully with sarees, lehengas and indo-western looks alike.`
        : `${name} is built for everyday life — it stays golden through showers, workouts and humid days. Lightweight, comfortable and easy to style with anything in your wardrobe.`,
      shortDescription: cat.description,
      images: Array.from(new Set([0, 1, 2].map((k) => pool[(i + off + k) % pool.length]))),
      tone: TONES[(counter + i) % TONES.length],
      rating: Math.round((4.3 + ((counter * 7) % 8) / 10) * 10) / 10,
      reviewCount: 12 + ((counter * 37) % 180),
      badge,
      isNew: badge === "NEW",
      isBestSeller: badge === "BEST SELLER",
      isFeatured: i === 0,
      stock: counter % 9 === 0 ? 0 : counter % 7 === 0 ? 4 : 10 + ((counter * 3) % 40),
      status: "ACTIVE" as const,
      features: festive ? FESTIVE_FEATURES : AT_FEATURES,
      material: festive
        ? "Brass base with 18K gold plating and premium American diamond stones."
        : "Stainless steel with PVD 18K gold coating — anti-tarnish and waterproof.",
      careInstructions: festive
        ? "Store in the box provided, away from moisture. Wipe with a soft cloth after wearing and avoid direct perfume spray."
        : "Safe in water, but pat dry after swimming or bathing. Avoid harsh chemicals and abrasive cleaners.",
      createdAt: `2026-09-${pad(1 + ((counter * 3) % 28))}T10:00:00+05:30`,
    };
  });
});

export const getProductBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
