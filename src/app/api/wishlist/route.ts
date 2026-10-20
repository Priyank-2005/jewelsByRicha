import { z } from "zod";
import prisma from "@/lib/db";
import { body, handle, ok, requireCustomer } from "@/lib/server/api";

export const GET = handle(async () => {
  const me = await requireCustomer();
  const items = await prisma.wishlistItem.findMany({ where: { userId: me.id }, select: { productId: true } });
  return ok({ ids: items.map((i) => i.productId) });
});

const schema = z.object({ productId: z.string().min(1).max(64) });

export const POST = handle(async (req: Request) => {
  const me = await requireCustomer();
  const { productId } = await body(req, schema);
  const exists = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (exists) await prisma.wishlistItem.upsert({ where: { userId_productId: { userId: me.id, productId } }, update: {}, create: { userId: me.id, productId } });
  return ok({ ok: true });
});

export const DELETE = handle(async (req: Request) => {
  const me = await requireCustomer();
  const productId = new URL(req.url).searchParams.get("productId");
  if (productId) await prisma.wishlistItem.deleteMany({ where: { userId: me.id, productId } });
  return ok({ ok: true });
});
