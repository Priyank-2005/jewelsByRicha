import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { ApiError, body, clientIp, handle, ok, rateLimit, requireAdmin } from "@/lib/server/api";

const schema = z.object({
  current: z.string().min(1).max(100),
  next: z
    .string()
    .min(10, "Use at least 10 characters")
    .max(100)
    .refine((p) => /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p), "Include upper and lower case letters and a number"),
});

export const POST = handle(async (req: Request) => {
  const admin = await requireAdmin();
  await rateLimit(`admin-pw:${clientIp(req)}`, 8, 15 * 60);
  const { current, next } = await body(req, schema);
  const user = await prisma.user.findUnique({ where: { id: admin.id } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) throw new ApiError(400, "Your current password is incorrect.");
  if (current === next) throw new ApiError(400, "Choose a password you haven't used just now.");
  await prisma.user.update({ where: { id: admin.id }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  return ok({ ok: true });
});
