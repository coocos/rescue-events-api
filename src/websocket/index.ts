import logger from "../logger";
import ws from "ws";
import http from "http";
import { RescueEvent } from "../types";

type Broadcast = (event: RescueEvent) => void;

function createWebSocketServer(httpServer: http.Server): ws.Server {
  const webSocketServer = new ws.Server({
    noServer: true,
  });
  httpServer.on("upgrade", (request, socket, head) => {
    if (request.url === "/websocket") {
      webSocketServer.handleUpgrade(request, socket, head, (client) => {
        webSocketServer.emit("connection", client, request);
      });
    } else {
      socket.destroy();
    }
  });
  return webSocketServer;
}

export default function webSocketServer(httpServer: http.Server): Broadcast {
  const webSocketServer = createWebSocketServer(httpServer);
  webSocketServer.on("connection", () => {
    logger.info("%d clients connected", webSocketServer.clients.size);
  });

  return (event) => {
    for (const client of Array.from(webSocketServer.clients)) {
      // FIXME: This might fail if the client has already disconnected
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(event));
      }
    }
  };
}
