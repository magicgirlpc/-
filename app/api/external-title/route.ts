const XINPIANCHANG_HOSTS = new Set(["xinpianchang.com", "www.xinpianchang.com"]);

export async function GET(request: Request) {
  const rawUrl = new URL(request.url).searchParams.get("url");

  if (!rawUrl) {
    return Response.json({ error: "Missing url" }, { status: 400 });
  }

  let externalUrl: URL;
  try {
    externalUrl = new URL(rawUrl);
  } catch {
    return Response.json({ error: "Invalid url" }, { status: 400 });
  }

  if (externalUrl.protocol !== "https:" || !XINPIANCHANG_HOSTS.has(externalUrl.hostname)) {
    return Response.json({ error: "Unsupported host" }, { status: 403 });
  }

  const articleId = externalUrl.pathname.match(/^\/a(\d+)/)?.[1];
  if (!articleId) {
    return Response.json({ error: "Unsupported page" }, { status: 422 });
  }

  try {
    const response = await fetch(`https://apis.netstart.cn/xpc/article/${articleId}?from=pc`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`Title request failed: ${response.status}`);

    const payload = await response.json() as { data?: { title?: string } };
    const title = payload.data?.title?.trim();
    if (!title) throw new Error("Title missing");

    return Response.json(
      { title },
      { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" } },
    );
  } catch {
    return Response.json({ error: "Unable to read title" }, { status: 502 });
  }
}
