"use client"
import { useSocket } from "@/hook/useSocket";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
    const { socket, loading } = useSocket(roomId);


    if (loading && !socket) {
        return <div>Connecting to server</div>
    }


    return (
        <>
            {socket && <Canvas roomId={roomId} socket={socket} />}
        </>
    )
}