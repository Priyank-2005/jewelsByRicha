import { handle, ok } from "@/lib/server/api";
import { customerSession } from "@/lib/server/session";

export const POST = handle(async () => {
  const s = await customerSession();
  s.destroy();
  return ok({ ok: true });
});
