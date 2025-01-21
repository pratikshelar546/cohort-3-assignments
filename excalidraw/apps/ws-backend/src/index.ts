import {WebSocketServer} from "ws";


const wss = new WebSocketServer({port:8080});

wss.on("connection", function connection (Ws){
    wss.on("message", function message(data){
        Ws.send("pong")
    })
})