import http from "http";
import express from "express";

export function startFeedServer(): Promise<http.Server> {
  const rawFeed = `
      <rss version="2.0">
        <channel>
          <title>Pelastustoimen mediapalvelu: ensitiedotteet</title>
          <link>http://www.peto-media.fi</link>
          <description>Ensitiedotteita Suomesta....</description>
          <language>FI-fi</language>
          <item>
            <title>Kokkola/Karleby, rakennuspalo: pieni</title>
            <description>01.03.2021 17:59:04 Kokkola/Karleby rakennuspalo: pieni</description>
            <link>http://www.peto-media.fi</link>
            <pubDate>Mon, 01 Mar 2021 17:59:04 +0200</pubDate>
          </item>
          <item>
            <title>Helsinki/Helsingfors, rakennuspalo: pieni</title>
            <description>01.03.2021 17:40:52 Helsinki/Helsingfors rakennuspalo: pieni</description>
            <link>http://www.peto-media.fi</link>
            <pubDate>Mon, 01 Mar 2021 17:40:52 +0200</pubDate>
          </item>
        </channel>
      </rss>
  `;
  const app = express();
  app.get("/rss.xml", (req, res) => {
    res.set("Content-Type", "text/xml");
    res.send(rawFeed);
  });
  return new Promise((resolve) => {
    const server = app.listen(8081, "localhost", () => {
      resolve(server);
    });
  });
}
