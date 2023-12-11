const {makeAutoObservable} = require("mobx");

class CanvasState {
    canvas = null;
    socket = null;
    sessionId = null;
    undoList = [];
    redoList = [];
    username = '';
    strokeColor = 'black';
    fillColor = 'black';
    lineWidth = 1;

    constructor() {
        makeAutoObservable(this);
    }

    setUsername(name) {
        this.username = name;
    }

    setStrokeColor(color) {
        this.strokeColor = color;
    }

    setFillColor(color) {
        this.fillColor = color;
    }

    setLineWidth(width) {
        this.lineWidth = width;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    setSessionId(id) {
        this.sessionId = id;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    pushToUndo(data) {
        this.undoList.push(data);
    }

    pushToRedo(data) {
        this.redoList.push(data);
    }

    undo() {
        let ctx = this.canvas.getContext('2d');
        if (this.undoList.length > 0) {
            let dataUrl = this.undoList.pop();
            this.pushToRedo(this.canvas.toDataURL());
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
        } else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }

    redo() {
        let ctx = this.canvas.getContext('2d');
        if (this.redoList.length > 0) {
            let dataUrl = this.redoList.pop();
            this.pushToUndo(this.canvas.toDataURL());
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
        }
    }
}

export default new CanvasState();