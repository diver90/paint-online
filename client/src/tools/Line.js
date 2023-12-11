import Tool from "./Tool";
import canvasState from "../store/canvasState";

export default class Line extends Tool{

    mouseDown = false;

    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
        this.name = 'Line';
    }
    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }

    mouseUpHandler(event){
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: "line",
                x: this.x,
                y: this.y,
                startX: this.startX,
                startY: this.startY,
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

    mouseDownHandler(event){
        this.mouseDown = true;
        this.ctx.strokeStyle = canvasState.strokeColor;
        this.ctx.fillStyle = canvasState.fillColor;
        this.ctx.lineWidth = canvasState.lineWidth;
        this.ctx.beginPath();
        this.startX = event.pageX - event.target.offsetLeft;
        this.startY = event.pageY - event.target.offsetTop;
        this.saved = this.canvas.toDataURL();
    }

    mouseMoveHandler(event){
        if (this.mouseDown){
            this.x = event.pageX - event.target.offsetLeft;
            this.y = event.pageY - event.target.offsetTop;
            this.draw(this.x, this.y);
        }
    }

    draw(x, y){
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0,0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY );
            this.ctx.lineTo(x, y);
            this.ctx.fill();
            this.ctx.stroke();
            console.log('Draw circle')
        }
    }

    static staticDraw(ctx, startX, startY, x, y, strokeColor, fillColor, lineWidth){
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.fill();
        ctx.stroke();
        console.log('Draw Line');
    }
}