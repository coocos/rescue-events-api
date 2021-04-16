import http from "http";
import express from "express";
import { AddressInfo } from "net";
import axios from "axios";
import WebSocket from "ws";

import config from "./config";
import db from "./db";
import { events } from "./services/events";
import { startServer } from "./server";

function startFeedServer(): Promise<http.Server> {
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

describe("Server", () => {
  let server: http.Server;
  let feedServer: http.Server;

  beforeAll(async () => {
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await events.clear();
    feedServer = await startFeedServer();
    const { address, port } = feedServer.address() as AddressInfo;
    config.feed.url = `http://${address}:${port}/rss.xml`;
    config.feed.schedule = "* * * * * *";
    server = startServer();
  });

  afterEach(async () => {
    server.close();
    feedServer.close();
  });

  afterAll(async () => {
    await db.migrate.rollback();
    await db.destroy();
  });

  it("fetches events from feed and lists them via REST API", async (done) => {
    const timer = setInterval(async () => {
      const response = await axios.get(
        `http://localhost:${config.port}/api/v1/events/`
      );
      expect(response.status).toEqual(200);
      if (response.data.length == 2) {
        expect(response.data).toEqual([
          {
            type: "rakennuspalo: pieni",
            location: "Kokkola",
            time: "2021-03-01T15:59:04.000Z",
          },
          {
            type: "rakennuspalo: pieni",
            location: "Helsinki",
            time: "2021-03-01T15:40:52.000Z",
          },
        ]);
        clearInterval(timer);
        done();
      }
    }, 250);
  });

  it("fetches events from feed and broadcasts them to WebSocket clients", (done) => {
    const client = new WebSocket(`ws://localhost:${config.port}/websocket`);
    const messages: { type: string; location: string; time: string }[] = [];
    client.on("message", (data) => {
      messages.push(JSON.parse(data.toString()));
      if (messages.length == 2) {
        expect(messages).toEqual([
          {
            type: "rakennuspalo: pieni",
            location: "Kokkola",
            time: "2021-03-01T15:59:04.000Z",
          },
          {
            type: "rakennuspalo: pieni",
            location: "Helsinki",
            time: "2021-03-01T15:40:52.000Z",
          },
        ]);
        client.close();
        done();
      }
    });
  });
});
