import prisma from "@/lib/db";
import { ApiError, body, handle, ok, requireAdmin } from "@/lib/server/api";
import { categorySchema, slugify } from "@/lib/server/admin-schemas";
import { toCategory } from "@/lib/server/mappers";

const MAX_HOME_CATEGORIES = 8;

export const PUT = handle(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const input = await body(req, categorySchema);
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Category not found");
  const slug = input.slug || slugify(input.name);
  const clash = await prisma.category.findUnique({ where: { slug } });
  if (clash && clash.id !== id) throw new ApiError(409, "That URL slug is already in use");
  if (input.showOnHome && !existing.showOnHome && (await prisma.category.count({ where: { showOnHome: true } })) >= MAX_HOME_CATEGORIES) {
    throw new ApiError(400, `Only ${MAX_HOME_CATEGORIES} categories can be shown on the homepage. Turn another one off first.`);
  }
  const c = await prisma.$transaction(async (tx) => {
    // moving a category to another collection moves its products too
    if (existing.collectionId !== input.collectionId) await tx.product.updateMany({ where: { categoryId: id }, data: { collectionId: input.collectionId } });
    return tx.category.update({ where: { id }, data: { name: input.name, slug, collectionId: input.collectionId, description: input.description, artKind: input.kind, sortOrder: input.sortOrder, active: input.active, showOnHome: input.showOnHome } });
  });
  return ok({ category: toCategory(c) });
});

export const DELETE = handle(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const n = await prisma.product.count({ where: { categoryId: id } });
  if (n > 0) throw new ApiError(400, `Move or delete its ${n} product${n === 1 ? "" : "s"} first.`);
  await prisma.category.delete({ where: { id } }).catch(() => {
    throw new ApiError(404, "Category not found");
  });
  return ok({ ok: true });
});
