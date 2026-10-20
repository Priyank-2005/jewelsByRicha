import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { ApiError, body, clientIp, emailSchema, handle, ok, rateLimit } from "@/lib/server/api";
import { customerSession } from "@/lib/server/session";

const schema = z.object({ email: emailSchema, password: z.string().min(1).max(100) });

// Compared against when the email is unknown, so response time doesn't reveal which emails have accounts
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export const POST = handle(async (req: Request) => {
  const { email, password } = await body(req, schema);
  await rateLimit(`login:ip:${clientIp(req)}`, 20, 15 * 60);
  await rateLimit(`login:email:${email}`, 8, 15 * 60);

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid || user.role !== "CUSTOMER") throw new ApiError(401, "Incorrect email or password.");

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await prisma.order.updateMany({ where: { email, userId: null }, data: { userId: user.id } });

  const s = await customerSession();
  s.userId = user.id;
  s.role = "CUSTOMER";
  await s.save();
  return ok({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone ?? undefined } });
});
