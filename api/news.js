// Vercel serverless function: first-party news relay for SahodKo.
// Fetches Google News RSS server-side (no browser CORS limits) and
// caches the result on Vercel's edge for 30 minutes so Google sees
// very little traffic from us.
module.exports = async (req, res) => {
  const q = String((req.query && req.query.q) || '').slice(0, 120);
  if (!q) {
    res.status(400).json({ error: 'missing q parameter' });
    return;
  }
  try {
    const rss = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-PH&gl=PH&ceid=PH:en`;
    const upstream = await fetch(rss, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; SahodKoNews/1.0)' }
    });
    if (!upstream.ok) {
      res.status(502).json({ error: `upstream status ${upstream.status}` });
      return;
    }
    const xml = await upstream.text();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.status(200).send(xml);
  } catch (e) {
    res.status(502).json({ error: 'news fetch failed' });
  }
};
