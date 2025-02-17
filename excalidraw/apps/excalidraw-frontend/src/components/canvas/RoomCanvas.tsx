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
            <h1 className="text-center font-bold text-2xl">Excali draw</h1>
            {socket && <Canvas roomId={roomId} socket={socket} />}
        </>
    )
}