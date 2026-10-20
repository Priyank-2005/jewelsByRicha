import prisma from "@/lib/db";
import { ApiError, body, handle, ok, requireAdmin } from "@/lib/server/api";
import { couponSchema } from "@/lib/server/admin-schemas";
import { toCoupon } from "@/lib/server/mappers";

export const PUT = handle(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const i = await body(req, couponSchema);
  if (!(await prisma.coupon.findUnique({ where: { id } }))) throw new ApiError(404, "Coupon not found");
  const clash = await prisma.coupon.findUnique({ where: { code: i.code } });
  if (clash && clash.id !== id) throw new ApiError(409, "A coupon with this code already exists");
  const c = await prisma.coupon.update({
    where: { id },
    data: { ...i, maxDiscount: i.maxDiscount ?? null, usageLimit: i.usageLimit ?? null, perCustomerLimit: i.perCustomerLimit ?? null, expiresAt: new Date(`${i.expiresAt}T23:59:59+05:30`) },
  });
  return ok({ coupon: toCoupon(c) });
});

export const DELETE = handle(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  await prisma.coupon.delete({ where: { id } }).catch(() => {
    throw new ApiError(404, "Coupon not found");
  });
  return ok({ ok: true });
});
