function joinNs(endpoint) {
    if(nsSocket) {
        //when switching namespaces
        //check if nsSocket is actually a socket.....close allready existing nsSocket
        //overwrting nsSocket is not enough, we should close the existing connection of client1 with namspe1 when he moves to namspc2
        //cause we'll create again a new connection when he hops back to namspce1
        nsSocket.close()
        //remove all prev eventListeners attached to user-input, before added again
        document.querySelector('#user-input').removeEventListener('submit', formSubmission)
      } 
    nsSocket = io(`${endpoint}`)  
    nsSocket.on('nsRooms', nsRooms => {
        let roomList = document.querySelector('.room-list')
        roomList.innerHTML = '' 

        nsRooms.forEach(room => {
            let glyph
            if(room.privateRoom) glyph='lock'
            else glyph = 'globe'
            roomList.innerHTML += `<li class="room" roomId='${room.roomId}'><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`
        })

        //add clickListeners to each room
         //grab all the rooms, using class name 'room', isiliy dia tha
        let roomNodes = document.getElementsByClassName('room')
        Array.from(roomNodes).forEach(roomNode => {
            roomNode.addEventListener('click', (e) => {
                //use roomId attribute to identify which room it is
                console.log('clicked', e.target.innerHTML)
                joinRoom(`${e.target.innerText}`)
            })
        })

        //make user join the first room automatically, hardcoded
        const topRoom = document.querySelector('.room')   //picks the 1st elemt
        const topRoomName = topRoom.innerText
        joinRoom(topRoomName) 
    })
    nsSocket.on('messageToClients', msg => {
        console.log(msg)
        const newMsg = buildHTML(msg)
        document.querySelector('#messages').innerHTML += newMsg
    })
    document.querySelector('#user-input').addEventListener('submit',formSubmission)
}

const formSubmission = event => {
    event.preventDefault()
    const newMessage = document.querySelector('#user-message').value
    nsSocket.emit('newMessageToServer', {text: newMessage})
    console.log(newMessage)
}

const buildHTML = msg => {
    const convertedDate = new Date(msg.time).toLocaleString()
    const newHTML = `
                <li>
                    <div class="user-image">
                        <img src="${msg.avatar}" />
                    </div>
                    <div class="user-message">
                        <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
                        <div class="message-text">${msg.text}</div>
                    </div>
                </li>
                `
    return newHTML
} 