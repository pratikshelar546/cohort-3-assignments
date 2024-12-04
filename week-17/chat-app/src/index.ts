import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface Users {
  socket: WebSocket;
  room: string;
}
let allSocket: Users[] = [];

// const message = {
//   type: "join",
//   payload: {
//     roomId: "red",
//   },
// };

// const message = {
//   type: "chat",
//   payload: {
//     message: "hello",
//   },
// };

wss.on("connection", function (socket) {
  socket.on("message", (message) => {
    // @ts-ignore
    const parseMessage = JSON.parse(message);

    if (parseMessage.type == "join") {
      allSocket.push({
        socket: socket,
        room: parseMessage.payload.room,
      });
    }

    if (parseMessage.type == "chat") {
      const currentUserRoom = allSocket.find((x) => x.socket == socket)?.room;

      allSocket.map((user) => {
        if (user.room == currentUserRoom) {
          console.log("true");

          user.socket.send(parseMessage.payload.message);
        }
      });
    }
  });
});
