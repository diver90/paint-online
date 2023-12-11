const {makeAutoObservable} = require("mobx");

class ToolState{
    tool = null;

    constructor() {
        makeAutoObservable(this);
    }

    setTool(tool){
        this.tool = tool;
    }

    setStrokeColor(color){
        this.tool.strokeColor = color;
    }

    setFillColor(color){
        this.tool.fillColor = color;
    }

    setLineWidth(width){
        this.tool.lineWidth = width;
    }
}

export default new ToolState();