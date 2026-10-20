import { handle, ok } from "@/lib/server/api";
import { getCustomer } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export const GET = handle(async () => ok({ user: await getCustomer() }));
