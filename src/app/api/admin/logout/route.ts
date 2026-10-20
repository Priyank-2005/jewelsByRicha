import { handle, ok } from "@/lib/server/api";
import { adminSession } from "@/lib/server/session";

export const POST = handle(async () => {
  const s = await adminSession();
  s.destroy();
  return ok({ ok: true });
});
