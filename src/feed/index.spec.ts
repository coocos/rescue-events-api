import { mapFeedToEvents } from "./index";

describe("Feed parser", () => {
  it("maps feed items to event objects", async () => {
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
    const events = await mapFeedToEvents(rawFeed);
    expect(events).toEqual([
      {
        type: "rakennuspalo: pieni",
        location: "Kokkola",
        time: new Date("2021-03-01T15:59:04.000Z"),
      },
      {
        type: "rakennuspalo: pieni",
        location: "Helsinki",
        time: new Date("2021-03-01T15:40:52.000Z"),
      },
    ]);
  });
});
