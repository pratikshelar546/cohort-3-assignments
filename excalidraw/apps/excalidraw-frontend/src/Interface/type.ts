export type Shape = {
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

} | {
    type: 'pencil',
    path: [{ x: number, y: number }],
    line: number
} | {
    type: "triangle",
    x: number,
    y: number,
    base: number,
    height: number
}

export type Tool = 'circle' | 'rect' | 'pencli' | 'triangle' | 'select'