import { body, handle, ok, requireAdmin } from "@/lib/server/api";
import { orderPatchSchema } from "@/lib/server/admin-schemas";
import { adminUpdateOrder } from "@/lib/server/orders";

export const PUT = handle(async (req: Request, ctx: { params: Promise<{ number: string }> }) => {
  await requireAdmin();
  const { number } = await ctx.params;
  const patch = await body(req, orderPatchSchema);
  return ok({ order: await adminUpdateOrder(number, patch) });
});
