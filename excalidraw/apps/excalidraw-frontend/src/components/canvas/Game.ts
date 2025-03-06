import { Shape, Tool } from "@/Interface/type";
import { deleteShape, getExistingShape } from "./CanvasLogic";


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
    private base = 0
    private triHeight = 0
    socket: WebSocket
    private offsetX = 0
    private offsetY = 0
    private selectedShape: Shape | null
    private drag: boolean
    private selectedIndex = 0

    constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
        this.ctx = canvas.getContext("2d")!;
        this.roomId = roomId
        this.canvas = canvas
        this.existingShapes = [];
        this.socket = socket
        this.clicked = false;
        this.init();
        // this.initHandler();
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
        this.ctx.strokeStyle = "rgba(255,255,255)"

        this.existingShapes.map((message) => {
            // console.log(message);
            const shape = message?.message

            if (shape.type === "rect") {
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
            } else if (shape.type === "triangle") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x, shape.y + shape.height);
                this.ctx.lineTo(shape.x + shape.base, shape.y + shape.height);
                this.ctx.lineTo(shape.x + shape.base / 2, shape.y);
                this.ctx.closePath();
                this.ctx.stroke();
            }
        })
    }
    initHandler() {
        this.socket.onmessage = (event) => {
            const respsone = JSON.parse(event.data)
        }
    }

    isInsideCircle(shape: { centerX: number, centerY: number, radius: number, type: string }, mouseX: number, mouseY: number): boolean {
        const dx = mouseX - shape.centerX;
        const dy = mouseY - shape.centerY;
        const distance = dx * dx + dy * dy;
        // const radius = shape.radius * shape.radius
        const borderThreshold = 5;

        return (
            distance >= (shape.radius - borderThreshold) ** 2 &&
            distance <= (shape.radius + borderThreshold) ** 2
        )
    }

    isInsideTriangle(shape: Shape, mouseX: number, mouseY: number) {
        const { x, y, base, height } = shape;
        const x1 = x, y1 = y + height; // Bottom-left
        const x2 = x + base, y2 = y + height; // Bottom-right
        const x3 = x + base / 2, y3 = y; // Top

        const areaOrig = Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
        const area1 = Math.abs((mouseX * (y2 - y3) + x2 * (y3 - mouseY) + x3 * (mouseY - y2)) / 2.0);
        const area2 = Math.abs((x1 * (mouseY - y3) + mouseX * (y3 - y1) + x3 * (y1 - mouseY)) / 2.0);
        const area3 = Math.abs((x1 * (y2 - mouseY) + x2 * (mouseY - y1) + mouseX * (y1 - y2)) / 2.0);

        return (area1 + area2 + area3) === areaOrig;
    }

    isOnPencil(shape: Shape, mouseX: number, mouseY: number): boolean {
        if (!shape?.path || shape.path.length === 0) return false;

        return shape.path.some((point) => {
            const tolerance = 4; // Allow slight variations

            return (
                Math.abs(point.x - mouseX) <= tolerance &&
                Math.abs(point.y - mouseY) <= tolerance
            );
        });
    }

    setTool(tool: Tool) {
        this.selectedTool = tool
    }

    mouseDownHandler = (e: { clientX: number; clientY: number; }) => {
        if (this.selectedTool === "select") return

        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

    }


    mouseUpHandler = async (e: { clientX: number; clientY: number; }) => {
        if (this.selectedTool === "select") return
        this.clicked = false;
        const selectedTool = this.selectedTool;
        console.log(selectedTool);

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
        else if (selectedTool === 'triangle') {
            shape = {
                type: "triangle",
                base: this.base,
                height: this.triHeight,
                x: this.startX,
                y: this.startY
            }
        }

        if (!shape) return

        // this.existingShapes.push(shape)

        const messageData = JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            roomId: Number(this.roomId)
        });
    
        return new Promise((resolve) => {
            this.socket.send(messageData);
    
            // Wait for confirmation from the server before calling init()
            this.socket.onmessage = (event) => {
                resolve(this.init());  // Call init() only after confirmation
            };
        });
    
        this.path = [];
    }


    mouseMoveHandler = (e: { clientX: number; clientY: number; }) => {
        if (this.selectedTool === "select") return
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
            else if (selectedTool === "triangle") {
                this.clearCanvas();
                const mouseX = e.clientX - this.canvas.offsetLeft;
                const mouseY = e.clientY - this.canvas.offsetTop;
                this.base = mouseX - this.startX;
                this.triHeight = mouseY - this.startY;

                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY + this.triHeight);  // Point 1 (right point)
                this.ctx.lineTo(this.startX + this.base, this.startY + this.triHeight);  // Point 2 (top point)
                this.ctx.lineTo(this.startX + this.base / 2, this.startY);
                this.ctx.closePath()
                this.ctx.stroke()

            }
        }
    }

    handleSelect = (e: { clientX: number; clientY: number; }) => {
        if (this.selectedTool !== "select") return
        const mouseX = e.clientX - this.canvas.offsetLeft;
        const mouseY = e.clientY - this.canvas.offsetTop;
        // this.clearCanvas();
        this.drag = true
        this.selectedShape = null;
        console.log(mouseX, mouseY);

        for (const message of this.existingShapes) {
            const shape = message?.message

            if (shape.type === "circle" && this.isInsideCircle(shape, mouseX, mouseY) || shape.type === "triangle" && this.isInsideTriangle(shape, mouseX, mouseY) || shape.type === "pencil" && this.isOnPencil(shape, mouseX, mouseY)) {
                this.selectedShape = shape;
                this.selectedIndex = message.id

                if (shape.type === 'circle') {
                    this.offsetX = mouseX - shape.centerX;
                    this.offsetY = mouseY - shape.centerY
                    break
                } else if (shape.type === 'triangle') {
                    this.offsetX = mouseX - shape.x;
                    this.offsetY = mouseY - shape.y
                    break
                }
            }
        }
        console.log(this.selectedShape);


        if (this.selectedShape?.type === "circle") {
            this.clearCanvas();
            this.ctx.beginPath();
            this.ctx.strokeStyle = "red"
            this.ctx.arc(this.selectedShape.centerX, this.selectedShape.centerY, Math.abs(this.selectedShape.radius), 0, Math.PI * 2)
            this.ctx.stroke();
            this.ctx.closePath();

        } else if (this.selectedShape?.type == 'triangle') {
            const shape = this.selectedShape
            this.ctx.strokeStyle = "blue"

            this.ctx.beginPath();
            this.ctx.moveTo(shape.x, shape.y + shape.height);
            this.ctx.lineTo(shape.x + shape.base, shape.y + shape.height);
            this.ctx.lineTo(shape.x + shape.base / 2, shape.y);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    dragHandle = (e: { clientX: number; clientY: number; }) => {
        if (this.selectedTool !== "select") return
        const mouseX = e.clientX - this.canvas.offsetLeft;
        const mouseY = e.clientY - this.canvas.offsetTop;
        if (this.drag) {

            if (this.selectedShape?.type === 'circle') {
                this.selectedShape.centerX = mouseX - this.offsetX;
                this.selectedShape.centerY = mouseY - this.offsetY
            }
            if (this.selectedShape?.type === 'triangle') {
                this.selectedShape.x = mouseX - this.offsetX;
                this.selectedShape.y = mouseY - this.offsetY
            }
            this.clearCanvas();
        }
    }

    handleLeaveMouse = () => {
        if (this.selectedTool !== "select") return

        this.drag = false
    }

    deleteSelectedShape = async () => {
        this.existingShapes = this.existingShapes.filter(shape => shape != this.selectedShape)
        this.clearCanvas();
        await deleteShape(this.selectedIndex)
        this.init();
    }
    handleDeleteKey = (e: { key: string }) => {
        if (e.key === "d" || e.key === "Backspace" || e.key === "delete") {
            this.deleteSelectedShape();
        }
    };

    initMouseHandler() {

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)

        // select shape
        this.canvas.addEventListener("mousedown", this.handleSelect)
        this.canvas.addEventListener("mousemove", this.dragHandle)
        this.canvas.addEventListener("mouseup", this.handleLeaveMouse)

        // handle delete
        document.addEventListener("keypress", this.handleDeleteKey);
        // this.canvas.addEventListener("mouseover")
    }

    distroy() {
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
        this.canvas.removeEventListener("mousedown", this.handleSelect)
        this.canvas.removeEventListener("mousemove", this.dragHandle)

        this.canvas.removeEventListener("mouseup", this.handleLeaveMouse)
        document.removeEventListener("keypress", this.handleDeleteKey);


    }
}