import { z } from "zod";
import prisma from "@/lib/db";
import { body, clientIp, emailSchema, handle, ok, rateLimit } from "@/lib/server/api";
import { createOtp } from "@/lib/server/otp";
import { sendOtpEmail } from "@/lib/server/email";

const schema = z.object({ email: emailSchema });

/** Always answers "ok" so it can't be used to discover which emails have an account. */
export const POST = handle(async (req: Request) => {
  const { email } = await body(req, schema);
  await rateLimit(`forgot:ip:${clientIp(req)}`, 8, 15 * 60);
  await rateLimit(`forgot:email:${email}`, 3, 15 * 60);

  const user = await prisma.user.findUnique({ where: { email } });
  let devOtp: string | undefined;
  if (user && user.role === "CUSTOMER") {
    const otp = await createOtp(email, "reset");
    await sendOtpEmail(email, otp, "reset");
    if (process.env.NODE_ENV !== "production" && !process.env.SMTP_HOST) devOtp = otp;
  }
  return ok({ ok: true, devOtp });
});
