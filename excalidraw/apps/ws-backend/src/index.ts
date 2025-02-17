import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-comman/config';
import { prismaClient } from "@repo/database/client";



const wss = new WebSocketServer({ port: 8080 });

const validateUser = (token: string): string | null => {
    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "string") {
            return null
        }

        if (!decoded || !decoded.userId) return null

        return decoded.userId
    } catch (error) {
        return null
    }


}

interface User {
    rooms: string[],
    ws: WebSocket,
    userId: string
}

const users: User[] = [];

wss.on("connection", async function (ws, request) {
    const url = request.url;
    if (!url) ws.close();
    ws.send("hello from excali");

    const token = new URLSearchParams(url?.split("?")[1]).get("token") || ""

    const userId = validateUser(token);

    if (userId === null) {
        ws.send("Not authorized");
        ws.close();
        return null
    }
    // console.log(users, "frist");

    // console.log("eloo");

    users.push({
        rooms: [],
        userId: userId,
        ws: ws
    })
    // console.log(users, "second");

    ws.on("message", async function (data) {
        let parseData;

        if (typeof data !== "string") {
            parseData = JSON.parse(data.toString());
        } else {
            parseData = JSON.parse(data);
        }


        if (parseData.type === "join_room") {
            const user = users.find(user => user.ws === ws);
            // console.log(user?.rooms,"new room ");
            
            user?.rooms.push(parseData.roomId)
            // console.log("new USer", users);

        }

        if (parseData.type === "leave_room") {
            const user = users.find(user => user.ws === ws);
            if (!user) return;

            user.rooms.filter(room => room === parseData.roomId)
        }

        if (parseData.type === "chat") {
console.log(users);

            const roomId = parseData.roomId;
            const message = parseData.message;

            await prismaClient.chats.create({
                data: {
                    roomId,
                    message,
                    userId
                }
            })


            users.forEach(user => {
                console.log(user.rooms.includes(roomId),roomId);

                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        roomId: roomId,
                        message: message
                    }))
                }
            })

        }
    })

})

