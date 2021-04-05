import axios from "axios";
import { fetchFeedEvents } from "./feedService";

jest.mock("axios");

describe("Feed service", () => {
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
  it("reads feed and returns event objects", async () => {
    const mockAxios = axios as jest.Mocked<typeof axios>;
    mockAxios.get.mockResolvedValue({
      headers: {
        etag: "2f44c1b882ad71:0",
      },
      data: rawFeed,
    });
    mockAxios.head.mockResolvedValue({
      headers: {
        etag: "2f44c1b882ad71:0",
      },
    });
    const events = await fetchFeedEvents();
    expect(mockAxios.head).toHaveBeenCalled();
    expect(mockAxios.get).toHaveBeenCalled();
    expect(events).toEqual([
      {
        type: "rakennuspalo: pieni",
        location: "Kokkola",
        time: new Date("2021-03-01T15:59:04.000Z"),
        hash: "c7aae8a31f3d31d228aa33368be142663bad9577",
      },
      {
        type: "rakennuspalo: pieni",
        location: "Helsinki",
        time: new Date("2021-03-01T15:40:52.000Z"),
        hash: "169a28a0c1979d7c105490bde4e30ce5b64418a5",
      },
    ]);
  });
});
