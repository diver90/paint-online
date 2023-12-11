import Tool from "./Tool";
import canvasState from "../store/canvasState";

export default class Brush extends Tool{

    mouseDown = false;

    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
        this.name = 'Brush'

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
                type: "finish",
            }
        }))
    }

    mouseDownHandler(event){
        this.mouseDown = true;
        this.ctx.strokeStyle = canvasState.strokeColor;
        this.ctx.lineWidth = canvasState.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(event.pageX - event.target.offsetLeft, event.pageY - event.target.offsetTop);
    }

    mouseMoveHandler(event){
        if (this.mouseDown){
            // this.draw(event.pageX - event.target.offsetLeft, event.pageY - event.target.offsetTop);
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: "brush",
                    x: event.pageX - event.target.offsetLeft,
                    y: event.pageY - event.target.offsetTop,
                    strokeColor: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    static draw(ctx, x, y, strokeColor, lineWidth){
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
        console.log('Draw brush')
    }
}