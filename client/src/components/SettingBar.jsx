import React from 'react';
import '../styles/toolbar.scss';
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";

const changeColor = (e) => {
    canvasState.setStrokeColor(e.target.value);
}

const SettingBar = () => {
    return (
        <div className="setting-bar">
            <label htmlFor="line-width">Толщина линии</label>
            <input
                onChange={(e) => canvasState.setLineWidth(e.target.value) }
                id="line-width"
                defaultValue={1}
                type="number"
                min={1}
                max={32}
                style={{margin: '0 10px', maxWidth: '45px'}}/>
            <label htmlFor="stroke-color">Цвет обводки</label>
            <input
                id="stroke-color"
                className="toolbar__btn"
                type="color"
                onChange={ e => changeColor(e)}
                tyle={{margin: '0 10px', maxWidth: '45px'}}
            />
        </div>
    );
};

export default SettingBar;