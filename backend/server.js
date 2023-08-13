const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const sockets = require('socket.io')
const { v4: uuidv4 } = require('uuid');


const app = express();
const server = http.createServer(app);
const io = sockets(server);

const rooms = {} //hash map of rooms. a room is a list of sockets

io.on('connection', (socket) =>
{
    console.log('New client connected');

    const roomID = socket.handshake.query.roomID;

    if (!rooms[roomID])
    {
        rooms[roomID] = []
    }

    rooms[roomID].push(socket);

    socket.join(roomID)
    

    socket.on('message', (data) =>
    {
        console.log(data); //debugging
        
        io.to(roomID).emit('message', data);

    })

    socket.on('disconnect', () =>
    {
        console.log("Client disconnected")
    } ) 
})

app.use(bodyParser.json())


server.listen(process.env.PORT, () =>
{   
    console.log('Listening on Port ' + process.env.PORT);
})