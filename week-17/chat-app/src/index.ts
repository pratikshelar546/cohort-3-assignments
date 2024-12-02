import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;
let allSocket : WebSocket[] = [];
wss.on("connection", function (socket) {
  userCount = userCount + 1;
  allSocket.push(socket);
  console.log("connected successfully");
  socket.on("message", (message) => {
    allSocket.forEach((socket,index) =>
      socket.send(`${message} from user ${index+1}`)
    );
    // socket.send(`${message} from user ${userCount}`);
  });
  socket.on("error", (error) => {
    console.log(error);
  });
});
