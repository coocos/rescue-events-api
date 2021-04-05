import http from "http";
import { AddressInfo } from "net";
import axios from "axios";
import WebSocket from "ws";

import config from "../src/config";
import db from "../src/db";
import { startServer } from "../src/server";
import { startFeedServer } from "./fakeFeedServer";

describe("Service", () => {
  let server: http.Server;
  let feedServer: http.Server;

  beforeEach(async () => {
    await db.migrate.latest();
    feedServer = await startFeedServer();
    const { address, port } = feedServer.address() as AddressInfo;
    config.feed.url = `http://${address}:${port}/rss.xml`;
    config.feed.schedule = "* * * * * *";
    server = startServer();
  });

  afterEach(async () => {
    server.close();
    feedServer.close();
    await db.migrate.rollback();
  });

  afterAll(async () => {
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
            hash: "c7aae8a31f3d31d228aa33368be142663bad9577",
          },
          {
            type: "rakennuspalo: pieni",
            location: "Helsinki",
            time: "2021-03-01T15:40:52.000Z",
            hash: "169a28a0c1979d7c105490bde4e30ce5b64418a5",
          },
        ]);
        client.close();
        done();
      }
    });
  });
});
