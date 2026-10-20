import prisma from "@/lib/db";
import { ApiError, body, handle, ok, requireAdmin } from "@/lib/server/api";
import { productSchema, slugify } from "@/lib/server/admin-schemas";
import { toProduct } from "@/lib/server/mappers";
import { productData } from "@/lib/server/product-data";

export const POST = handle(async (req: Request) => {
  await requireAdmin();
  const input = await body(req, productSchema);
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw new ApiError(400, "Pick a valid category");
  const slug = input.slug || slugify(input.name);
  if (await prisma.product.findUnique({ where: { slug } })) throw new ApiError(409, "Another product already uses this URL slug");

  const created = await prisma.product.create({
    data: { ...productData(input), slug, collectionId: category.collectionId, images: { create: input.images.map((url, sortOrder) => ({ url, sortOrder })) } },
    include: { images: true },
  });
  return ok({ product: toProduct(created) }, { status: 201 });
});
