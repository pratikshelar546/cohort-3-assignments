import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-comman/config';
import { prismaClient } from "@repo/database/client";



const wss = new WebSocketServer({ port: 8080 });
const checkUser = (token: string): string | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded == "string") {
            return null;
        }
        if (!decoded || !decoded.userId) {
            return null;
        }

        return decoded.userId
    } catch (error) {
        return null
    }

}

interface User {
    ws: WebSocket,
    userId: string,
    rooms: string[]
}

const users: User[] = [];

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if (!url) {
        ws.close();
        return;
    }
    const token = new URLSearchParams(url.split('?')[1]).get('token') || "";

    const userId = checkUser(token);

    if (userId === null) {
        ws.close();
        return null;
    }
    users.push({
        userId,
        rooms: [],
        ws
    })

    ws.on("message",async function(data){
    const parseData = JSON.parse(data as unknown as string);
    
    if(parseData.type ==="join_room"){
        const user = users.find(user=>user.ws ==ws);
        user?.rooms.push(parseData.roomId)
    }
    if(parseData.type === "leave_room"){
        const user =users.find(user => user.ws===ws);

        if(!user){
            return;
        }
        user.rooms = user.rooms.filter(x=>x===parseData.roomID)
    }

    if(parseData.type === "chat"){
        const roomId = parseData.roomId;
        const message = parseData.message;

        await prismaClient.chats.create({
            data:{
                roomId,
                message,
                userId
            }
        })

        users.forEach(user=>{
           if(user.rooms.includes(roomId)){
            user.ws.send(JSON.stringify({
                type:"chat",
                message,
                roomId
            }))
           }
        })
    }
    })
})