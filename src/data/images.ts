/**
 * Editorial photography for banners (Unsplash, free licence) — stand-ins until Richa's own photos are supplied.
 * Files live in /public/images/hero. Product photos come from the database.
 */
export const hero = (id: string) => `/images/hero/${id}.jpg`;

export const HERO = {
  necklace: hero("1620656798579-1984d9e87df7"),
  jhumka: hero("1778148046574-c1509f5a40d4"),
  hoops: hero("1777999745587-31af0844db6c"),
  bangles: hero("1763578590148-fbac0711f3b2"),
  kada: hero("1723522938779-d434eb9294d4"),
  kadas: hero("1786052347285-3ad7f12c738f"),
};
