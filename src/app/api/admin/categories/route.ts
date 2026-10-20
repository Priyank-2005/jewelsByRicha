import prisma from "@/lib/db";
import { ApiError, body, handle, ok, requireAdmin } from "@/lib/server/api";
import { categorySchema, slugify } from "@/lib/server/admin-schemas";
import { toCategory } from "@/lib/server/mappers";

const MAX_HOME_CATEGORIES = 8;

export const POST = handle(async (req: Request) => {
  await requireAdmin();
  const input = await body(req, categorySchema);
  if (!(await prisma.collection.findUnique({ where: { id: input.collectionId } }))) throw new ApiError(400, "Pick a valid collection");
  const slug = input.slug || slugify(input.name);
  if (await prisma.category.findUnique({ where: { slug } })) throw new ApiError(409, "That URL slug is already in use");
  if (input.showOnHome && (await prisma.category.count({ where: { showOnHome: true } })) >= MAX_HOME_CATEGORIES) {
    throw new ApiError(400, `Only ${MAX_HOME_CATEGORIES} categories can be shown on the homepage. Turn another one off first.`);
  }
  const c = await prisma.category.create({ data: { name: input.name, slug, collectionId: input.collectionId, description: input.description, artKind: input.kind, sortOrder: input.sortOrder, active: input.active, showOnHome: input.showOnHome } });
  return ok({ category: toCategory(c) }, { status: 201 });
});
