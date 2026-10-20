import prisma from "@/lib/db";
import { ApiError, body, clientIp, handle, ok, rateLimit, requireAdmin } from "@/lib/server/api";
import { productSchema, slugify } from "@/lib/server/admin-schemas";
import { toProduct } from "@/lib/server/mappers";
import { productData } from "@/lib/server/product-data";

export const dynamic = "force-dynamic";

export const GET = handle(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const p = await prisma.product.findUnique({ where: { id }, include: { images: true } });
  if (!p) throw new ApiError(404, "Product not found");
  return ok({ product: toProduct(p) });
});

export const PUT = handle(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  await rateLimit(`admin-write:${clientIp(req)}`, 120, 60);
  const { id } = await ctx.params;
  const input = await body(req, productSchema);
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Product not found");
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw new ApiError(400, "Pick a valid category");
  const slug = input.slug || slugify(input.name);
  const clash = await prisma.product.findUnique({ where: { slug } });
  if (clash && clash.id !== id) throw new ApiError(409, "Another product already uses this URL slug");

  const updated = await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });
    return tx.product.update({
      where: { id },
      data: { ...productData(input), slug, collectionId: category.collectionId, images: { create: input.images.map((url, sortOrder) => ({ url, sortOrder })) } },
      include: { images: true },
    });
  });
  return ok({ product: toProduct(updated) });
});

export const DELETE = handle(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  await rateLimit(`admin-write:${clientIp(req)}`, 120, 60);
  const { id } = await ctx.params;
  // order history keeps its snapshot of name / price; the link to the product is simply cleared
  await prisma.product.delete({ where: { id } }).catch(() => {
    throw new ApiError(404, "Product not found");
  });
  return ok({ ok: true });
});
