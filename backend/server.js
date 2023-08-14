const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server,
    {
        cors: {
            origin: "*"
        }
    });
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');

require('dotenv').config()
const rooms = {} //hash map of rooms. a room is a list of sockets

io.on('connection', (socket) =>
{
    socket.username = "Guest_" + socket.id;
    console.log(socket.username + ' has connected');

    socket.on('set_username', (username) =>
    {
        socket.username = username;
    })

    socket.on('join', (roomID) => {

        for (let room in socket.rooms) //disconnects from all other rooms
        {
            if (room !== socket.id)
            {
                socket.leave(room);
            }
        }

        if (!rooms[roomID])
        {
            rooms[roomID] = []
        }

        rooms[roomID].push(socket);

        socket.join(roomID)
        socket.score = 0

        console.log(socket.username + " joined room " + roomID);
    })

    socket.on('message', (data) =>
    {
        
        const room = getSocketRoom(socket);

        console.log(data + " was said in room " + room);

        io.to(room).emit('message', data);

    })

    socket.on('leave', (roomID) =>
    {
        removeSocket(socket, roomID);
        socket.leave(roomID);
        console.log(`socket ${socket.id} left room: ${roomID}`)
    })

    socket.on('disconnect', () =>
    {
        try {
        const roomID = getSocketRoom(socket);

        removeSocket(socket, roomID);
        socket.leave(roomID);
        console.log(socket.username + " disconnected")
        }
        catch (error)
        {
            console.error(error);
        }
    } ) 
})

const getSocketRoom = (socket) =>
{
    const rooms = Array.from(socket.rooms).filter(room => room !== socket.id)

    return rooms[0] || null;
}

const removeSocket = (sct, roomID) =>
{
    const room = rooms[roomID];

    if (room)
    {
        room.filter((socket) => socket !== sct)
        console.log('removed ' + sct.username + ' from room ' + roomID)
    }
    
}

app.use(bodyParser.json())

app.get('/test', (req, res) =>
{
    res.status(200).json({message: "hi"})
})

app.get('/rooms/:id', (req, res) =>
{
    const roomID = req.params.id;

    const roomData = rooms[roomID]; //list of sockets in that room

    if (!roomData)
    {
        return res.status(404).json({error: 'Room not found'});
    }

    const clientData = roomData.map(socket => (
        {
            username: socket.username,
            score: socket.score,
        }
    ));

    res.status(200).json(clientData);


})

server.listen(process.env.PORT, () =>
{   
    console.log('Listening on Port ' + process.env.PORT);
})