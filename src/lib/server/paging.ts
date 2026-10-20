/** Reads ?page= and ?pageSize= from a request URL, with safe bounds. */
export function paging(req: Request, defaultSize = 20, maxSize = 100) {
  const u = new URL(req.url);
  const page = Math.max(1, Math.floor(Number(u.searchParams.get("page"))) || 1);
  const pageSize = Math.min(maxSize, Math.max(1, Math.floor(Number(u.searchParams.get("pageSize"))) || defaultSize));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize, params: u.searchParams };
}

export const pageMeta = (page: number, pageSize: number, total: number) => ({ page, pageSize, total, pages: Math.max(1, Math.ceil(total / pageSize)) });
