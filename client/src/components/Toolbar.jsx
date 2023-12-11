import React from 'react';
import '../styles/toolbar.scss';
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import Brush from "../tools/Brush";
import Rectangle from "../tools/Rectangle";
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";

const Toolbar = () => {

    const changeColor = (e) => {
        canvasState.setStrokeColor(e.target.value)
        canvasState.setFillColor(e.target.value)
    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = canvasState.sessionId + ".jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <div className="toolbar">
            <button className="toolbar__btn brush"
                    onClick={() => toolState.setTool(
                        new Brush(
                            canvasState.canvas,
                            canvasState.socket,
                            canvasState.sessionId
                        )
                    )}/>
            <button className="toolbar__btn rectangle"
                    onClick={() => toolState.setTool(
                        new Rectangle(
                            canvasState.canvas,
                            canvasState.socket,
                            canvasState.sessionId
                        )
                    )}/>
            <button className="toolbar__btn circle"
                    onClick={() => toolState.setTool(
                        new Circle(
                            canvasState.canvas,
                            canvasState.socket,
                            canvasState.sessionId
                        )
                    )}/>
            <button className="toolbar__btn eraser"
                    onClick={() => toolState.setTool(
                        new Eraser(
                            canvasState.canvas,
                            canvasState.socket,
                            canvasState.sessionId
                        )
                    )}/>
            <button className="toolbar__btn line"
                    onClick={() => toolState.setTool(
                        new Line(
                            canvasState.canvas,
                            canvasState.socket,
                            canvasState.sessionId
                        )
                    )}/>
            <input
                className="toolbar__btn"
                type="color"
                onChange={ e => changeColor(e)}
            />
            <p>{'username'}</p>
            <button className="toolbar__btn undo" onClick={() => canvasState.undo()}/>
            <button className="toolbar__btn redo" onClick={() => canvasState.redo()}/>
            <button className="toolbar__btn save" onClick={() => download()}/>
        </div>
    );
};

export default Toolbar;