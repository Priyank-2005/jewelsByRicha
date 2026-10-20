import { body, handle, ok, requireAdmin } from "@/lib/server/api";
import { settingsSchema } from "@/lib/server/admin-schemas";
import { getSettings, saveSettings } from "@/lib/server/settings";

export const GET = handle(async () => {
  await requireAdmin();
  return ok({ settings: await getSettings() });
});

export const PUT = handle(async (req: Request) => {
  await requireAdmin();
  const input = await body(req, settingsSchema);
  return ok({ settings: await saveSettings(input) });
});
