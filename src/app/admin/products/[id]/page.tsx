"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { api } from "@/lib/client/api";
import type { Product } from "@/types/shop";

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    api<{ product: Product }>(`/api/admin/products/${id}`)
      .then((r) => setProduct(r.product))
      .catch(() => setProduct(null));
  }, [id]);

  if (product === undefined) return <p className="text-muted">Loading…</p>;
  if (product === null) return <p className="text-muted">Product not found. <Link href="/admin/products" className="underline">Back to products</Link></p>;
  return <ProductForm key={product.id} product={product} />;
}
