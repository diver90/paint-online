import Tool from "./Tool";
import canvasState from "../store/canvasState";

export default class Circle extends Tool {

    mouseDown = false;

    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
        this.name = 'Circle'
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }

    mouseUpHandler(event) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: "circle",
                x: this.startX,
                y: this.startY,
                radius: this.radius,
                strokeColor: this.ctx.strokeStyle,
                fillColor: this.ctx.fillStyle,
                lineWidth: this.ctx.lineWidth
            }
        }));
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: "finish",
            }
        }))
    }

    mouseDownHandler(event) {
        this.mouseDown = true;
        this.ctx.strokeStyle = canvasState.strokeColor;
        this.ctx.fillStyle = canvasState.fillColor;
        this.ctx.lineWidth = canvasState.lineWidth;
        this.ctx.beginPath();
        this.startX = event.pageX - event.target.offsetLeft;
        this.startY = event.pageY - event.target.offsetTop;
        this.saved = this.canvas.toDataURL();
    }

    mouseMoveHandler(event) {
        if (this.mouseDown) {
            let currentX = event.pageX - event.target.offsetLeft;
            let currentY = event.pageY - event.target.offsetTop;
            let width = currentX - this.startX;
            let height = currentY - this.startY;
            this.radius = Math.sqrt((height ** 2 + width ** 2));
            this.draw(
                this.startX,
                this.startY,
                this.radius
            );
        }
    }

    draw(x, y, radius) {
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.arc(
                x,
                y,
                radius,
                0,
                360
            );

            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    static staticDraw(ctx, x, y, radius, strokeColor, fillColor, lineWidth) {
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(
            x,
            y,
            radius,
            0,
            360
        );

        ctx.fill();
        ctx.stroke();
        console.log('Draw circle');
    }
}