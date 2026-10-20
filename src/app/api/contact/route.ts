import { z } from "zod";
import prisma from "@/lib/db";
import { body, clientIp, emailSchema, handle, ok, rateLimit } from "@/lib/server/api";
import { sendContactNotification } from "@/lib/server/email";
import { getSettings } from "@/lib/server/settings";

const schema = z.object({ name: z.string().trim().min(2).max(80), email: emailSchema, message: z.string().trim().min(5).max(2000) });

export const POST = handle(async (req: Request) => {
  const input = await body(req, schema);
  await rateLimit(`contact:${clientIp(req)}`, 5, 60 * 60);
  await prisma.contactMessage.create({ data: input });
  const s = await getSettings();
  void sendContactNotification(s.contactEmail, input.name, input.email, input.message);
  return ok({ ok: true }, { status: 201 });
});
