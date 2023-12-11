import Brush from "./Brush";

export default class Eraser extends Brush{

    mouseDown = false;

    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
        this.name = 'Eraser';

    }

    mouseMoveHandler(event){
        if (this.mouseDown){
            // this.draw(event.pageX - event.target.offsetLeft, event.pageY - event.target.offsetTop);
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: "erase",
                    x: event.pageX - event.target.offsetLeft,
                    y: event.pageY - event.target.offsetTop,
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    static draw(ctx, x, y, lineWidth){
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
        console.log('Erase')
    }
}