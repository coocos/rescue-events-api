import axios from "axios";
import iconv from "iconv-lite";
import hash from "object-hash";
import Parser from "rss-parser";

import config from "../config";
import { RescueEvent } from "./events";

const cache = {
  etag: "",
  content: "",
};

async function decodeFeed(): Promise<string> {
  const { headers } = await axios.head(config.feed.url);
  if (cache.etag === headers.etag) {
    return cache.content;
  }
  const response = await axios.get<ArrayBuffer>(config.feed.url, {
    responseType: "arraybuffer",
  });
  const decoded = iconv.decode(Buffer.from(response.data), "iso-8859-1");
  cache.etag = headers.etag;
  cache.content = decoded;
  return decoded;
}

export async function fetchFeedEvents(): Promise<RescueEvent[]> {
  const parser = new Parser({
    headers: { Accept: "application/rss+xml, text/xml; q=0.1" },
  });
  const feed = await parser.parseString(await decodeFeed());
  return feed.items.map((item) => {
    if (item.title === undefined) {
      throw new Error(`Failed to parse ${item}`);
    }
    const [location, type] = item.title?.split(",");
    const finnishLocation = location.split("/")[0].trim();
    const event = {
      location: finnishLocation.trim(),
      type: type.trim(),
      time: new Date(item.isoDate ?? new Date()),
    };
    return {
      ...event,
      hash: hash(event),
    };
  });
}
