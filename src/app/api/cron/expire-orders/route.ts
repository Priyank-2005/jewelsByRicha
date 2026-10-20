import crypto from "crypto";
import { expireUnpaidOrders } from "@/lib/server/orders";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Scheduled housekeeping (see vercel.json): cancels online orders left unpaid for an hour so their stock is released,
 * and clears expired rate-limit / OTP rows. Protected by CRON_SECRET (Vercel sends it as a Bearer token).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer /, "");
  const a = Buffer.from(given);
  const b = Buffer.from(secret ?? "");
  if (!secret || a.length !== b.length || !crypto.timingSafeEqual(a, b)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const expired = await expireUnpaidOrders();
  const now = new Date();
  const [rl, otp] = await Promise.all([prisma.rateLimit.deleteMany({ where: { expireAt: { lt: now } } }), prisma.verificationCode.deleteMany({ where: { expiresAt: { lt: now } } })]);
  return Response.json({ expiredOrders: expired, clearedRateLimits: rl.count, clearedCodes: otp.count });
}
