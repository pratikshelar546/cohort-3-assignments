import { useEffect, useRef } from "react";
import { initDraw } from "./CanvasLogic";

export default function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            initDraw(canvas,socket, roomId);
        }
    }, [canvasRef,roomId])
    return (
        <>
            <div className="w-screen h-screen bg-white">

                <canvas ref={canvasRef} width={"1000"} height={"1000"}></canvas>
            </div>
        </>
    )
}