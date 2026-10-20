import { z } from "zod";
import prisma from "@/lib/db";
import { body, clientIp, emailSchema, handle, ok, rateLimit } from "@/lib/server/api";

const schema = z.object({ email: emailSchema });

export const POST = handle(async (req: Request) => {
  const { email } = await body(req, schema);
  await rateLimit(`news:${clientIp(req)}`, 10, 60 * 60);
  await prisma.subscriber.upsert({ where: { email }, update: {}, create: { email } });
  return ok({ ok: true }, { status: 201 });
});
