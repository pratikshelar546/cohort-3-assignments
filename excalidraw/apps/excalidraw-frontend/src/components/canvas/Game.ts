import { Shape, Tool } from "@/Interface/type";
import { getExistingShape } from "./CanvasLogic";


export class Game {
    private ctx: CanvasRenderingContext2D
    private roomId: string
    private existingShapes: Shape[]
    private canvas: HTMLCanvasElement
    private clicked: boolean
    private startX = 0
    private startY = 0
    private selectedTool: Tool = 'circle'
    socket: WebSocket
    constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
        this.ctx = canvas.getContext("2d")!;
        this.roomId = roomId
        this.canvas = canvas
        this.existingShapes = [];
        this.socket = socket
        this.clicked = false;
        this.init();
        this.initHandler();
        this.initMouseHandler();


    }
    async init() {
        this.existingShapes = await getExistingShape(this.roomId);
        this.clearCanvas();
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,0,0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255,255,255)"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
            }

            else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2)
                this.ctx.stroke();
                this.ctx.closePath();
            }
        })
    }
    initHandler() {
        this.socket.onmessage = (event) => {
            const respsone = JSON.parse(event.data)

            if (respsone.type === "chat") {
                const parseShape = JSON.parse(respsone.message)

                this.existingShapes.push(parseShape);
                this.clearCanvas()
            }
        }
    }

    setTool(tool: Tool) {
        this.selectedTool = tool
    }
    // @ts-ignore
    mouseDownHandler = (e) => {
        this.clicked = true
        this.startX = e.clientX;
        this.startY = e.clientY
    }
    // @ts-ignore
    mouseUpHandler = (e) => {
        this.clicked = false;
        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        if (selectedTool === 'rect') {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width,
                height

            }
        } else if (selectedTool === 'circle') {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: 'circle',
                centerX: this.startX + radius,
                centerY: this.startY + radius,
                radius
            }
        } else if (selectedTool === 'pencli') {

        }
        if (!shape) return
        this.existingShapes.push(shape)
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            roomId: Number(this.roomId)
        }))

    }
    // @ts-ignore
    mouseMoveHandler = (e) => {
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            const selectedTool = this.selectedTool;

            this.ctx.strokeStyle = "rgba(255,255,255)"
            if (selectedTool === "rect") {
                this.clearCanvas();
                this.ctx.strokeRect(this.startX, this.startY, width, height)
            }
            else if (selectedTool === "circle") {
                this.clearCanvas();
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();

            } else if (selectedTool === "pencli") {
                this.ctx.lineWidth = 2
                this.ctx.lineCap = 'round'
                const startFrom = e.clientX - this.canvas.offsetLeft
                const startTo = e.clientY - this.canvas.offsetTop
                // startFrom += Math.random() * 2 - 1
                // startTo += Math.random() * 2 - 1
                this.ctx.beginPath()
                this.ctx.moveTo(this.startX, this.startY)
                this.ctx.lineTo(startFrom, startTo)
                this.ctx.stroke()
                // this.ctx.closePath();
                this.startX = e.clientX
                this.startY = e.clientY
                console.log(startFrom, startTo);

            }
        }
    }

    initMouseHandler() {
        this.canvas.addEventListener("mouseup", this.mouseUpHandler)
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)

    }

    distroy() {
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)

    }
}