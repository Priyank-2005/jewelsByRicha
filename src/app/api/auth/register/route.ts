import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { ApiError, body, clientIp, emailSchema, handle, ok, phoneSchema, rateLimit } from "@/lib/server/api";
import { createOtp } from "@/lib/server/otp";
import { sendOtpEmail } from "@/lib/server/email";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const POST = handle(async (req: Request) => {
  const input = await body(req, schema);
  await rateLimit(`register:ip:${clientIp(req)}`, 8, 15 * 60);
  await rateLimit(`register:email:${input.email}`, 4, 15 * 60);

  if (await prisma.user.findUnique({ where: { email: input.email } })) throw new ApiError(409, "An account with this email already exists. Please sign in.");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const otp = await createOtp(input.email, "register", { name: input.name, phone: input.phone || null, passwordHash });
  await sendOtpEmail(input.email, otp, "register");

  // Local development only: with no mail server configured the code is returned so the flow can be tested.
  const devOtp = process.env.NODE_ENV !== "production" && !process.env.SMTP_HOST ? otp : undefined;
  return ok({ ok: true, devOtp });
});
