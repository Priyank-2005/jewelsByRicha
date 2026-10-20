import prisma from "@/lib/db";
import { ApiError, body, handle, ok, requireCustomer } from "@/lib/server/api";
import { addressInputSchema } from "@/lib/server/orders";

async function owned(id: string, userId: string) {
  const a = await prisma.address.findUnique({ where: { id } });
  if (!a || a.userId !== userId) throw new ApiError(404, "Address not found");
  return a;
}

export const PUT = handle(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const me = await requireCustomer();
  const { id } = await ctx.params;
  await owned(id, me.id);
  const input = await body(req, addressInputSchema);
  const updated = await prisma.$transaction(async (tx) => {
    if (input.isDefault) await tx.address.updateMany({ where: { userId: me.id }, data: { isDefault: false } });
    return tx.address.update({ where: { id }, data: input });
  });
  return ok({ address: { id: updated.id, name: updated.name, phone: updated.phone, line: updated.line, city: updated.city, state: updated.state, pincode: updated.pincode, isDefault: updated.isDefault } });
});

export const DELETE = handle(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const me = await requireCustomer();
  const { id } = await ctx.params;
  const a = await owned(id, me.id);
  await prisma.address.delete({ where: { id } });
  if (a.isDefault) {
    const next = await prisma.address.findFirst({ where: { userId: me.id }, orderBy: { id: "asc" } });
    if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
  }
  return ok({ ok: true });
});
