import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { ApiError, body, clientIp, emailSchema, handle, ok, rateLimit } from "@/lib/server/api";
import { adminSession } from "@/lib/server/session";

const schema = z.object({ email: emailSchema, password: z.string().min(1).max(100) });
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export const POST = handle(async (req: Request) => {
  const { email, password } = await body(req, schema);
  await rateLimit(`admin-login:ip:${clientIp(req)}`, 15, 15 * 60);
  await rateLimit(`admin-login:email:${email}`, 6, 15 * 60);

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid || user.role !== "ADMIN") throw new ApiError(401, "Incorrect email or password.");

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const s = await adminSession();
  s.userId = user.id;
  s.role = "ADMIN";
  await s.save();
  return ok({ admin: { id: user.id, name: user.name, email: user.email } });
});
