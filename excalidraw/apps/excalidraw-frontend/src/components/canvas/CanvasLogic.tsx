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
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,

}
export async function initDraw(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    const ctx = canvas.getContext("2d");
    const existingCanvas: shape[] = await getExistingShape(roomId);
    const type: 'circle' | 'rect' = "rect"
    if (!ctx) return;

    socket.onmessage = (event) => {
        const respsone = JSON.parse(event.data)

        if (respsone.type === "chat") {
            const parseShape = JSON.parse(respsone.message)

            existingCanvas.push(parseShape);
            clearCanvas(canvas, ctx, existingCanvas)
        }
    }

    clearCanvas(canvas, ctx, existingCanvas)
    let clicked = false;
    let startX = 0;
    let startY = 0;
    let radius = 0, startAngle = 0, endAngle = 0

    canvas.addEventListener('mousedown', (e) => {
        clicked = true
        startX = e.clientX;
        startY = e.clientY

    })

    canvas.addEventListener('mouseup', (e) => {
        clicked = false

        if (type === "circle") {
            ctx.lineWidth = 2; // Adjust border thickness
            ctx.stroke();
            ctx.fillStyle = "rgba(0,0,0)";
            const shape: shape = {
                type: "circle",
                x: startX,
                y: startY,
                radius: radius,
                startAngle: startAngle,
                endAngle: endAngle
            }
            console.log(shape);

            existingCanvas.push(shape)
            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: Number(roomId)
            }))
            return
        }
        if (type === "rect") {

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

        }
    })

    canvas.addEventListener('mousemove', (e) => {

        if (clicked) {

            const width = e.clientX - startX;
            const height = e.clientY - startY
            if (type === "rect") {

                clearCanvas(canvas, ctx, existingCanvas)
                ctx.strokeStyle = "rgba(255,255,255)"
                ctx.strokeRect(startX, startY, width, height)
            }

            if (type === "circle") {
                ctx.beginPath();
                clearCanvas(canvas, ctx, existingCanvas)

                radius = Math.sqrt((e.clientX - startX) ** 2 + (e.clientY - startY) ** 2);
                startAngle = 0;
                endAngle = 2 * Math.PI
                clearCanvas(canvas, ctx, existingCanvas)

                ctx.arc(startX, startY, radius, startAngle, endAngle)
                ctx.strokeStyle = "rgba(255, 255, 255, 1)"; // White border
                ctx.lineWidth = 2; // Adjust border thickness
                ctx.stroke();
                ctx.fillStyle = "rgba(0,0,0)";

            }
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
        if (shape.type === "circle") {
            ctx.arc(shape.x, shape.y, shape.radius, shape.startAngle, shape.endAngle)
            ctx.strokeStyle = "rgba(255, 255, 255, 1)"; // White border
            ctx.lineWidth = 2; // Adjust border thickness
            ctx.stroke();
            ctx.fillStyle = "rgba(0,0,0)";
        }

        // if(shape.type==="circle"){
        //     // ctx.arc()
        //     ctx.beginPath()
        //     ctx.arc(shape.x)
        // }
    })
}

export async function getExistingShape(roomId: string) {
    const response = await axios.get(`${BACKEND_URL}/chat/${roomId}`)
    const message = response.data.messages;
    const shapes = message.map((x: { message: string }) => {
        // console.log(x, "fromshaps");

        const data = JSON.parse(x.message)
        return data
    })
    return shapes
}