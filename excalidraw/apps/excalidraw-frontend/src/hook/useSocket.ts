"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "../config/config";


export function useSocket(roomId: string) {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket | null>();
   
    useEffect(() => {
        const token = localStorage.getItem("token")
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId:Number(roomId)
            }))
        }
    }, [])

    return {
        socket, loading
    }
}