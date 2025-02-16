import { BACKEND_URL } from "@/config/config";
import axios from "axios";

type shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number
}
export async function initDraw(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    const ctx = canvas.getContext("2d");
    let existingCanvas: shape[] = await getExistingShape(roomId);
    console.log(existingCanvas);

    if (!ctx) return;

    socket.onmessage = (event) => {
        const respsone = JSON.parse(event.data)
        console.log(respsone, "ws res");

        if (respsone.type === "chat") {
            const parseShape = JSON.parse(respsone.message.shape)
            existingCanvas.push(parseShape);
            clearCanvas(canvas, ctx, existingCanvas)
        }
    }

    clearCanvas(canvas, ctx, existingCanvas)
    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener('mousedown', (e) => {
        clicked = true
        startX = e.clientX;
        startY = e.clientY

    })

    canvas.addEventListener('mouseup', (e) => {
        clicked = false
        const shape: shape = {
            type: "rect",
            x: startX,
            y: startY,
            width: e.clientX - startX,
            height: e.clientY - startY
        }
        existingCanvas.push(shape)
        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            roomId: Number(roomId)
        }))

    })

    canvas.addEventListener('mousemove', (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY
            clearCanvas(canvas, ctx, existingCanvas)
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx.strokeRect(startX, startY, width, height)
        }

    })
}

function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, existingShape: shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingShape.map((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
    })
}

async function getExistingShape(roomId: string) {
    const response = await axios.get(`${BACKEND_URL}/chat/${roomId}`)
    console.log(response.data);

    const message = response.data.messages;

    const shapes = message.map((x: { message: string }) => {
        console.log(x, "fromshaps");

        const data = JSON.parse(x.message)
        return data
    })
    return shapes
}