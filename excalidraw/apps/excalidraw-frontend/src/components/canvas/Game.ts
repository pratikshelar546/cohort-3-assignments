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
    private path: [{ x: number, y: number }] | []
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
        this.path = [];


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
            } else if (shape.type === 'pencil') {
                this.ctx.lineWidth = shape.line
                this.ctx.lineCap = 'round'
                const path = shape.path || [];

                if (path.length > 1) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(path[0].x, path[0].y);

                    path.forEach(point => {
                        this.ctx.lineTo(point.x, point.y)
                    });
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
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
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

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

            shape = {
                type: 'pencil',
                path: this.path,
                line: 2
            }

        }
        if (!shape) return
        this.existingShapes.push(shape)

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            roomId: Number(this.roomId)
        }))
        this.path = [];

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
                
                this.path.push({ x: startFrom, y: startTo })
                this.ctx.beginPath()
                this.ctx.moveTo(this.startX, this.startY)
                this.ctx.lineTo(startFrom, startTo)
                this.ctx.stroke()
                // this.ctx.closePath();
                this.startX = e.clientX
                this.startY = e.clientY

            }
            else if(selectedTool === "triangle"){
                console.log("tirhdh");
                
                const width = this.canvas.width;
                const height = this.canvas.height;
                const mouseX = e.clientX - this.canvas.offsetLeft;
    const mouseY = e.clientY - this.canvas.offsetTop;
                this.ctx.beginPath();
                this.ctx.moveTo(mouseX + 50, mouseY);  // Point 1 (right point)
                this.ctx.lineTo(mouseX, mouseY - 50);  // Point 2 (top point)
                this.ctx.lineTo(mouseX - 50, mouseY); 
                this.ctx.stroke()   
                this.ctx.closePath()

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