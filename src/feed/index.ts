import axios from "axios";
import iconv from "iconv-lite";
import Parser from "rss-parser";
import { RescueEvent } from "../types";

export async function decodeFeed(): Promise<string> {
  const response = await axios.get<ArrayBuffer>(
    "http://www.peto-media.fi/tiedotteet/rss.xml",
    {
      responseType: "arraybuffer",
    }
  );
  return iconv.decode(Buffer.from(response.data), "iso-8859-1");
}

export async function mapFeedToEvents(rawFeed: string): Promise<RescueEvent[]> {
  const parser = new Parser({
    headers: { Accept: "application/rss+xml, text/xml; q=0.1" },
  });
  const feed = await parser.parseString(rawFeed);
  return feed.items.map((item) => {
    if (item.title === undefined) {
      throw new Error(`Failed to parse ${item}`);
    }
    const [location, type] = item.title?.split(",");
    const finnishLocation = location.split("/")[0].trim();
    return {
      location: finnishLocation.trim(),
      type: type.trim(),
      time: new Date(item.isoDate ?? new Date()),
    };
  });
}
