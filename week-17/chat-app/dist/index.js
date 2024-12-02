"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userCount = 0;
let allSocket = [];
wss.on("connection", function (socket) {
    userCount = userCount + 1;
    allSocket.push(socket);
    console.log("connected successfully");
    socket.on("message", (message) => {
        allSocket.forEach((socket, index) => socket.send(`${message} from user ${index + 1}`));
        // socket.send(`${message} from user ${userCount}`);
    });
    socket.on("error", (error) => {
        console.log(error);
    });
});
