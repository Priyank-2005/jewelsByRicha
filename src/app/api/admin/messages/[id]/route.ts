import { z } from "zod";
import prisma from "@/lib/db";
import { ApiError, body, handle, ok, requireAdmin } from "@/lib/server/api";

const schema = z.object({ handled: z.boolean() });

export const PUT = handle(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const { handled } = await body(req, schema);
  await prisma.contactMessage.update({ where: { id }, data: { handled } }).catch(() => {
    throw new ApiError(404, "Message not found");
  });
  return ok({ ok: true });
});

export const DELETE = handle(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  await prisma.contactMessage.delete({ where: { id } }).catch(() => {
    throw new ApiError(404, "Message not found");
  });
  return ok({ ok: true });
});
