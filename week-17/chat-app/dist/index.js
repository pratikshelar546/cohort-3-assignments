"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSocket = [];
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
        var _a;
        // @ts-ignore
        const parseMessage = JSON.parse(message);
        if (parseMessage.type == "join") {
            allSocket.push({
                socket: socket,
                room: parseMessage.payload.room,
            });
        }
        if (parseMessage.type == "chat") {
            const currentUserRoom = (_a = allSocket.find((x) => x.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
            allSocket.map((user) => {
                if (user.room == currentUserRoom) {
                    console.log("true");
                    user.socket.send(parseMessage.payload.message);
                }
            });
        }
    });
});
