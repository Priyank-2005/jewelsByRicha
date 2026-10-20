import type { ArtKind, Category, Collection } from "../../src/types/shop";

export const COLLECTIONS: Collection[] = [
  {
    id: "col-festive",
    name: "Festive Collection",
    slug: "festive",
    tagline: "Heirloom-inspired. Made to be noticed.",
    description:
      "Statement kadas, Kashmiri-inspired pieces and sparkling American-diamond sets for festivals, parties and every celebration in between.",
  },
  {
    id: "col-anti-tarnish",
    name: "Anti Tarnish",
    slug: "anti-tarnish",
    tagline: "Waterproof. Skin-friendly. Everyday gold.",
    description:
      "Daily-wear jewellery that stays golden through showers, workouts and monsoons — anti-tarnish and waterproof by design.",
  },
];

const HOME = new Set(["heritage-bangle-kada", "kashmiri-earrings", "festive-necklaces", "pendant-sets", "mangalsutra", "hoop-earrings", "rings", "watches"]);
const c = (
  id: string,
  collectionId: string,
  name: string,
  slug: string,
  kind: ArtKind,
  sortOrder: number,
  description: string,
): Category => ({ id, collectionId, name, slug, kind, sortOrder, description, active: true, showOnHome: HOME.has(slug) });

export const CATEGORIES: Category[] = [
  // Festive collection
  c("cat-f1", "col-festive", "Kashmiri Watches", "kashmiri-watches", "watch", 1, "Ornate watches with Kashmiri-inspired detailing."),
  c("cat-f2", "col-festive", "Necklaces", "festive-necklaces", "necklace", 2, "Statement necklaces for festive evenings."),
  c("cat-f3", "col-festive", "Heritage Bangle Kada", "heritage-bangle-kada", "bangle", 3, "Heirloom-inspired kadas with antique finish."),
  c("cat-f4", "col-festive", "Pendant Sets", "pendant-sets", "pendant", 4, "Pendant, chain and earring sets, ready to gift."),
  c("cat-f5", "col-festive", "AD Bangle Kada", "ad-bangle-kada", "bangle", 5, "American-diamond studded kadas that catch every light."),
  c("cat-f6", "col-festive", "Kashmiri Earrings", "kashmiri-earrings", "drop", 6, "Jhumkas and chandbalis in Kashmiri style."),
  c("cat-f7", "col-festive", "Moissanite Earrings", "moissanite-earrings", "stud", 7, "Brilliant moissanite earrings with fire and sparkle."),
  c("cat-f8", "col-festive", "Festive Bracelets", "festive-bracelets", "bracelet", 8, "Dressy bracelets to stack or wear solo."),
  c("cat-f9", "col-festive", "Stud Earrings", "stud-earrings", "stud", 9, "Sparkling studs for every celebration."),
  // Anti tarnish
  c("cat-a1", "col-anti-tarnish", "Mangalsutra", "mangalsutra", "mangalsutra", 1, "Modern, lightweight mangalsutras for everyday wear."),
  c("cat-a2", "col-anti-tarnish", "Bracelet Kada", "bracelet-kada", "bangle", 2, "Sleek kadas that never lose their shine."),
  c("cat-a3", "col-anti-tarnish", "Chain Bracelets", "chain-bracelets", "chain-bracelet", 3, "Delicate chains for stacking."),
  c("cat-a4", "col-anti-tarnish", "Rings", "rings", "ring", 4, "Minimal and statement rings."),
  c("cat-a5", "col-anti-tarnish", "Hoop Earrings", "hoop-earrings", "hoop", 5, "Classic hoops in every size."),
  c("cat-a6", "col-anti-tarnish", "Danglers Earrings", "danglers-earrings", "drop", 6, "Playful danglers that move with you."),
  c("cat-a7", "col-anti-tarnish", "Studs Earrings", "studs-earrings", "stud", 7, "Everyday studs that go with everything."),
  c("cat-a8", "col-anti-tarnish", "Chain Necklaces", "chain-necklaces", "chain-necklace", 8, "Fine chains, layered or worn alone."),
  c("cat-a9", "col-anti-tarnish", "Combo Necklace Packs", "combo-necklace-packs", "combo", 9, "Layering sets — more sparkle for less."),
  c("cat-a10", "col-anti-tarnish", "Watches", "watches", "watch", 10, "Slim, minimal watches in gold and black."),
];

