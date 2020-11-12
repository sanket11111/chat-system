function joinRoom(roomName) {
    
    //send this roomName to the server!
    nsSocket.emit('joinRoom', roomName, newNumberOfMembers => {
        //we want to update the room now that we have joined!
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers}<span class="glyphicon glyphicon-user"></span>`
    })
    nsSocket.on('historyCatchUp', history => {
      console.log(history)
      const messagesUl = document.querySelector('#messages')    //grab DOM #messages ul 
      messagesUl.innerHTML = ""
      history.forEach(h => {
        const message = buildHTML(h)
        messagesUl.innerHTML += message
      })
      messagesUl.scroll(0, messagesUl.scrollHeight)
    })
    nsSocket.on('updateClients', noOfClients => {
      document.querySelector('.curr-room-num-users').innerHTML = `${noOfClients}<span class="glyphicon glyphicon-user"></span>`
      document.querySelector('.curr-room-text').innerText = `${roomName}`
    })
    let searchBox = document.querySelector('#search-box')
    searchBox.addEventListener('input', event => {
      console.log(event.target.value)
      let messages = Array.from(document.getElementsByClassName('message-text'))
      messages.forEach(msg => {
        if(msg.innerText.toLowerCase().indexOf(event.target.value.toLowerCase())) {
          //the message does not contain the user search term
          msg.closest('li').style.display = 'none'
        } else { 
          msg.closest('li').style.display = 'block'
        }
      })
    })
} 

//function bhej rhe h, in 3rd argument, socket se, server argument daal ke execute kardega.....execute yahaan aake hoga, function mei yahaan ke variables involved h
 //a real handy way of doing i got your stuff and i'm sending you stuff back

//1.clientside se i cant join any room, client is not even aware of rooms, i'll have to ask the server to join me to a room
    //I can join namespaces, but only the server can manage the rooms
//2.i made nsSocket a global variable 
  //so now i can use nsSocket, through which i'mconnected to the seleted(by me,client!) namespace, 
  //asking the server to join that server to a specific room inside that namespace

//nsSOcket jisse namespace jon kia tha,now that i made it global,
  // i'm able to use that socket to send message to server