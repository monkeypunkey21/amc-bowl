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
        socket.leave(roomID);
        console.log(`socket ${socket.id} left room: ${roomID}`)
    })

    socket.on('disconnect', () =>
    {
        console.log("Client disconnected")
    } ) 
})

const getSocketRoom = (socket) =>
{
    const rooms = Array.from(socket.rooms).filter(room => room !== socket.id)

    return rooms[0] || null;
}

app.use(bodyParser.json())

app.get('/api', (req, res) =>
{
    res.status(200).json({message: "hi"})
})

server.listen(process.env.PORT, () =>
{   
    console.log('Listening on Port ' + process.env.PORT);
})