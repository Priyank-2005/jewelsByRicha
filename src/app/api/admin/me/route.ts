import { handle, ok, requireAdmin } from "@/lib/server/api";

export const GET = handle(async () => {
  const a = await requireAdmin();
  return ok({ admin: { id: a.id, name: a.name, email: a.email } });
});
