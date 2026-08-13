const candidates = [
  ["kr", "https://www.yna.co.kr/rss/news.xml"],
  ["gb", "https://feeds.bbci.co.uk/news/world/rss.xml"],
  ["jp", "https://www3.nhk.or.jp/rss/news/cat0.xml"],
  ["fr", "https://www.france24.com/fr/rss"],
  ["de", "https://rss.dw.com/rdf/rss-de-all"],
  ["es", "https://feeds.bbci.co.uk/mundo/rss.xml"],
];

const headers = { "user-agent": "Mozilla/5.0 (compatible; GlobalTimesBot/1.0)" };

async function fetchText(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers, signal: controller.signal });
    if (!response.ok) return "";
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function firstArticleUrl(xml) {
  const item = xml.match(/<item\b[\s\S]*?<\/item>/i)?.[0] ?? "";
  const cdataLink = item.match(/<link[^>]*>\s*<!\[CDATA\[([\s\S]*?)\]\]>/i)?.[1];
  const plainLink = item.match(/<link[^>]*>\s*([^<\s][^<]*)<\/link>/i)?.[1];
  const rdfLink = item.match(/<item\b[^>]*\brdf:about=["']([^"']+)["']/i)?.[1];
  return (cdataLink || plainLink || rdfLink || "").trim().replace(/&amp;/g, "&");
}

(async () => {
  for (const [country, feedUrl] of candidates) {
    try {
      const xml = await fetchText(feedUrl, 12_000);
      const articleUrl = firstArticleUrl(xml);
      if (!articleUrl) continue;
      const html = await fetchText(articleUrl, 12_000);
      const paragraphText = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
        .map((match) => match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join(" ");
      if (paragraphText.length >= 200) {
        process.stdout.write(country);
        return;
      }
    } catch {
      // Try the next free RSS/article candidate. No paid API is called here.
    }
  }
  process.exitCode = 1;
})();
