import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

/** Uptime check for monitoring (UptimeRobot, Vercel, load balancers). Reveals nothing beyond up/down. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ status: "down" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
