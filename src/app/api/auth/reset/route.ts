import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { ApiError, body, clientIp, emailSchema, handle, ok, rateLimit } from "@/lib/server/api";
import { checkOtp } from "@/lib/server/otp";

const schema = z.object({
  email: emailSchema,
  otp: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const POST = handle(async (req: Request) => {
  const { email, otp, password } = await body(req, schema);
  await rateLimit(`reset:ip:${clientIp(req)}`, 15, 15 * 60);

  const ok_ = await checkOtp(email, "reset", otp);
  if (!ok_) throw new ApiError(400, "That code is incorrect or has expired. Please request a new one.");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "CUSTOMER") throw new ApiError(400, "That code is incorrect or has expired. Please request a new one.");

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(password, 12) } });
  return ok({ ok: true });
});
