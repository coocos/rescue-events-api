import http from "http";
import WebSocket, { AddressInfo } from "ws";

import webSocketServer from "./server";

describe("WebSocket server", () => {
  let server: http.Server;

  beforeAll((done) => {
    server = http.createServer();
    server.listen(8000, "localhost");
    server.on("listening", done);
  });

  it("broadcasts events to clients", (done) => {
    const broadcast = webSocketServer(server);
    const { address, port } = server.address() as AddressInfo;

    const client = new WebSocket(`ws://${address}:${port}/websocket`);
    client.on("open", () => {
      broadcast({
        type: "rakennuspalo: keskisuuri",
        location: "Tuusula",
        time: new Date("2021-01-31T22:00:00.000Z"),
        hash: "2a39407ee0570aae8f3ba2842e11aa28ce0f5d9f",
      });
    });
    client.on("message", (data) => {
      const message = JSON.parse(data.toString());
      expect(message).toEqual({
        type: "rakennuspalo: keskisuuri",
        location: "Tuusula",
        time: "2021-01-31T22:00:00.000Z",
        hash: "2a39407ee0570aae8f3ba2842e11aa28ce0f5d9f",
      });
      client.close();
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });
});
