import prisma from "@/lib/db";
import { ApiError, body, handle, ok, requireAdmin } from "@/lib/server/api";
import { couponSchema } from "@/lib/server/admin-schemas";
import { toCoupon } from "@/lib/server/mappers";

export const POST = handle(async (req: Request) => {
  await requireAdmin();
  const i = await body(req, couponSchema);
  if (await prisma.coupon.findUnique({ where: { code: i.code } })) throw new ApiError(409, "A coupon with this code already exists");
  const c = await prisma.coupon.create({
    data: { ...i, maxDiscount: i.maxDiscount ?? null, usageLimit: i.usageLimit ?? null, perCustomerLimit: i.perCustomerLimit ?? null, expiresAt: new Date(`${i.expiresAt}T23:59:59+05:30`) },
  });
  return ok({ coupon: toCoupon(c) }, { status: 201 });
});
