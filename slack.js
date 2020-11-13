const express = require('express')
const app =express()
const socketio = require('socket.io')
const path = require('path')

const namespaces = require('./data/namespaces')
// console.log(namespaces[0])

const port = process.env.PORT || 9000

app.use(express.static(__dirname + '/public'))

// app.get('/', (req, res, next) => {
//     res.sendFile(path.join(__dirname,'./public', 'chat.html'))
// })

const expressServer = app.listen(port, console.log('connected to loalhost:', port))  

const io = socketio(expressServer) 



io.on('connection', socket => {        
   //build an array to send back img and endpoint of each ns
   const nsData = namespaces.map(ns => {
       return {
           img: ns.img,
           endpoint: ns.endpoint
       }
   })
   socket.emit('namespaceList', nsData)
//    console.log(nsData)
})
 
namespaces.forEach(namespace => { 
    io.of(namespace.endpoint).on('connection', nsSocket => {
        // console.log(`${socket.id} has joined ${namespace.endpoint}`)
        nsSocket.emit('nsRooms', namespace.rooms)
        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
            //deal with the history.. once we have it!
            //when user joins, 
            //make him join specified room
            //send him room history,no. on members
            console.log(nsSocket.rooms)
            const roomToLeave = Object.keys(nsSocket.rooms)[1]
            // const prevRoom = namespace.rooms.find(room =>  room.roomTitle == roomTitle)
            nsSocket.leave(roomToLeave)
            updateUsers(namespace, roomToLeave)
            nsSocket.join(roomToJoin) 
            // io.of(`${namespace.endpoint}`).in(roomToJoin).clients((error, clients) => {
            //     // console.log(clients.length)
            //     numberOfUsersCallback(clients.length)
            // })
            const nsRoom = namespace.rooms.find(room => room.roomTitle == roomToJoin)   
            nsSocket.emit('historyCatchUp', nsRoom.history)   //grabbed that room, aur history bhj di
            updateUsers(namespace, roomToJoin)
        })

        //client sends a message
        nsSocket.on('newMessageToServer', msg => {
            // console.log('received')
            //re-constructing the msg to send to the whole room 
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: "rbunch",
                avatar: 'https://via.placeholder.com/30'
            }
            // msg,Date.now() ke alava everything hardcoded
            // console.log(fullMsg)
            // Send this message to ALl the sockets that are in the room that this socket is in .
            //how can we find out what rooms THIS socket is in -> socket.rooms se
            // console.log(nsSocket.rooms)
            //the user will be in the 2nd room in the object list
            //this is because the socket ALWAYSS joins its own room on connection
            //get the keys,   second obj seedha grab nhi kar sakte, so array mei convert kar dia
            const roomTitle = Object.keys(nsSocket.rooms)[1]
            //We need to find the Room object for this room
            // console.log(roomTitle)
            const nsRoom = namespace.rooms.find(room => room.roomTitle == roomTitle)   //we pulled that roomobj out of namespaces.rooms
            // console.log(nsRoom) 
            nsRoom.addMessage(fullMsg)   //pushed msg into histry
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients',fullMsg) //uss namespace mei, uss room mei emit krdia io se-> matlab sab ke paas


        })

    })
})


const updateUsers = (namespace, roomToJoin) => {
    io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        console.log(clients.length)
        io.of(namespace.endpoint).in(roomToJoin).emit('updateClients', clients.length)
    })
}