const express = require('express');
const app = express();
const WSserver = require('express-ws')(app);
const aWss = WSserver.getWss();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.ws('/', (ws, req) => {
    console.log('Connected');
    ws.on('message', (msg) => {
        console.log(msg);
        msg = JSON.parse(msg);
        switch (msg.method){
            case "connection":
                connectionHandler(ws, msg)
                break;
            case "draw":
                broadcastConnection(ws, msg)
                break;
        }
    })
})

app.listen(PORT, () => console.log(`server started, port ${PORT}`));

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace('data:image/png;base64,', '');
        fs.writeFileSync(path.resolve(__dirname, 'images', `${req.query.id}.jpg`), data,'base64');
        return res.status(200).json(`Loaded`);
    } catch (e){
        console.log(e);
        return res.status(500).json('error');
    }
})

app.get('/image', (req, res) => {
    try {
        let data = {};
        if(fs.existsSync(path.resolve(__dirname, 'images', `${req.query.id}.jpg`))){
            let file = fs.readFileSync(path.resolve(__dirname, 'images', `${req.query.id}.jpg`));
            data = {
                type: 'exist',
                data: 'data:image/png;base64,'+file.toString('base64')
            }
            res.json(data);
        } else {
            data = {
                type: 'new',
            }
            res.json(data);
        }

    } catch (e){
        console.log(e);
        return res.status(500).json('error');
    }
})

const connectionHandler = (ws, msg) => {
    ws.id = msg.id;
    broadcastConnection(ws, msg);
}

const broadcastConnection = (ws, msg) => {
   aWss.clients.forEach(client => {
       if(client.id === msg.id){
           client.send(JSON.stringify(msg))
       }
   })
}
