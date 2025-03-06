import { useEffect, useRef, useState } from "react";
import { initDraw } from "./CanvasLogic";
import IconButton from "./IconButton";
import { Circle, MousePointerSquareDashed, Pencil, RectangleHorizontal, Triangle } from "lucide-react";
import { Game } from "./Game";
import { Tool } from "@/Interface/type";
export default function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const [activeTool, setActiveTool] = useState<Tool>("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        if (game) {
            game.setTool(activeTool)
        }
    }, [activeTool, game])

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const g = new Game(canvas, socket, roomId)
            setGame(g)
            return () => {
                g.distroy();
            }
        }
    }, [canvasRef, roomId])

    const setKeyDown = (event: React.KeyboardEvent<Element>) => {
        console.log(event);
        console.log(event.key);
    }
    return (
        <>
            <div className=" h-full overflow-hidden">

                <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} onKeyDown={(e: React.KeyboardEvent) => setKeyDown(e)}></canvas>
                <div className="fixed top-10 left-16 ">

                    <TopBar activeTool={activeTool} setActiveTool={setActiveTool} />
                </div>
            </div>
        </>
    )
}


function TopBar({ activeTool, setActiveTool }: {
    activeTool: Tool,
    setActiveTool: (s: Tool) => void
}) {
    return (
        <div className="flex gap-5">
            <IconButton icon={<Pencil />} onClick={() => { setActiveTool("pencli") }} active={activeTool === "pencli"} />
            <IconButton icon={<RectangleHorizontal />} onClick={() => { setActiveTool("rect") }} active={activeTool === "rect"} />
            <IconButton icon={<Triangle />} onClick={() => { setActiveTool("triangle") }} active={activeTool === "triangle"} />
            <IconButton icon={<Circle />} onClick={() => { setActiveTool("circle") }} active={activeTool === "circle"} />
            <IconButton icon={<MousePointerSquareDashed />} onClick={() => { setActiveTool("select") }} active={activeTool === "select"} />


        </div>
    )

}