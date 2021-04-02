import logger from "../logger";
import ws from "ws";
import http from "http";

type Broadcast = (data: unknown) => void;

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
    logger.info(`${webSocketServer.clients.size} clients connected`);
  });

  return (data) => {
    for (const client of Array.from(webSocketServer.clients)) {
      // FIXME: This might fail if the client has already disconnected
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(data));
      }
    }
  };
}
