import React, {useEffect, useRef, useState} from 'react';
import '../styles/canvas.scss';
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {Form, Button, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";
import Rectangle from "../tools/Rectangle";
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";
import axios from "axios";

const Canvas = observer(() => {
    const canvasRef = useRef();
    const usernameRef = useRef();
    const [modal, setModal] = useState(true);
    const params = useParams();

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket(`ws://${process.env.REACT_APP_SERVER_URL}`);
            canvasState.setSocket(socket);
            canvasState.setSessionId(params.id);
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }));
            }
            socket.onmessage = (ev) => {
                let msg = JSON.parse(ev.data);
                switch (msg.method) {
                    case "connection":
                        console.log(`Пользователь ${msg.username} подключен`)
                        break;
                    case "draw":
                        drawHandler(msg)
                        break;
                }
                console.log(msg);
            }
        }
    }, [params.id, canvasState.username])

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
        console.log(`http://${process.env.REACT_APP_SERVER_URL}/image?id=${params.id}`);
        axios.get(`http://${process.env.REACT_APP_SERVER_URL}/image?id=${params.id}`)
            .then(res => {
                console.log(res);
                if (res.data.type === 'exist') {
                    const img = new Image();
                    const ctx = canvasRef.current.getContext('2d')
                    img.src = res.data.data;
                    img.onload = () => {
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    }
                } else {
                    Rectangle.staticDraw(
                        canvasState.canvas.getContext('2d'),
                        0,
                        0,
                        canvasState.canvas.width,
                        canvasState.canvas.height,
                        "#ffffff",
                        "#ffffff",
                        0)
                }
            });

    }, []);

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y, figure.strokeColor, figure.lineWidth)
                break;
            case "line":
                Line.staticDraw(ctx, figure.startX, figure.startY, figure.x, figure.y, figure.strokeColor, figure.fillColor, figure.lineWidth)
                break;
            case "rectangle":
                Rectangle.staticDraw(ctx, figure.x, figure.y, figure.w, figure.h, figure.strokeColor, figure.fillColor, figure.lineWidth)
                break;
            case "circle":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.radius, figure.strokeColor, figure.fillColor, figure.lineWidth)
                break;
            case "erase":
                Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth)
                break;
            case "finish":
                ctx.beginPath();
                break;
        }
    }

    const mouseUpHandler = () => {
        let url = `http://${process.env.REACT_APP_SERVER_URL}/image?id=${canvasState.sessionId}`;
        console.log(url);
        axios.post(
            url,
            {img: canvasRef.current.toDataURL()}
        )
            .then((res) => console.log(res))
            .catch(e => console.log(e));
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
    }

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value);
        setModal(false);
    }

    return (
        <div className="canvas">
            <Modal
                show={modal}
                onHide={() => {
                }}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Представтесь, пожалуйста</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="username" placeholder="Введите ваше имя" ref={usernameRef}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={() => mouseDownHandler()} onMouseUp={() => mouseUpHandler()} ref={canvasRef}
                    width={640} height={480}/>
        </div>
    );
});

export default Canvas;