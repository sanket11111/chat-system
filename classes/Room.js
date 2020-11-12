//we'll create rooms, 
   //a roomId, roomTitle, namespace 
  // namespace -> we dont need it, but it'll become easy reference what namespace it belongs to 
  //allthogh lots of ways to find that out

class Room {
    constructor(roomId, roomTitle, namespace, privateRoom = false) {
        this.roomId = roomId
        this.roomTitle = roomTitle
        this.namespace = namespace
        this.privateRoom = privateRoom
        this.history = []
    }
    addMessage(message) {
        this.history.push(message)
    }
    clearHistory() {
        this.hisory = []
    }
}

module.exports = Room