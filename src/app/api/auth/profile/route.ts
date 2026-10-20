import { z } from "zod";
import prisma from "@/lib/db";
import { body, handle, ok, phoneSchema, requireCustomer } from "@/lib/server/api";

const schema = z.object({ name: z.string().trim().min(2).max(80), phone: phoneSchema.optional().or(z.literal("")) });

export const PUT = handle(async (req: Request) => {
  const me = await requireCustomer();
  const input = await body(req, schema);
  const u = await prisma.user.update({ where: { id: me.id }, data: { name: input.name, phone: input.phone || null } });
  return ok({ user: { id: u.id, name: u.name, email: u.email, phone: u.phone ?? undefined } });
});
