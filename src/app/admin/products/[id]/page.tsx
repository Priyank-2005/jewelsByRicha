"use client";

import Link from "next/link";
import { use } from "react";
import { useCatalog } from "@/context/CatalogContext";
import { ProductForm } from "@/components/admin/ProductForm";

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, ready } = useCatalog();
  const product = products.find((p) => p.id === id);
  if (!product) {
    return <p className="text-muted">{ready ? <>Product not found. <Link href="/admin/products" className="underline">Back to products</Link></> : "Loading…"}</p>;
  }
  return <ProductForm key={product.id + String(ready)} product={product} />;
}
