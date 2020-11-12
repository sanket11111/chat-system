//we're gonna have individual objects which are namespaces, and add our rooms to theses 
  //namespace objects
//this is our factory for making namespaces, all namespaces will hve an id,
 //an image, namespace title and an endpoint. (localhost:9000/'what')

class Namespace {
    constructor(id, nsTitle, img, endpoint) {
        this.id = id
        this.img = img
        this.nsTitle = nsTitle
        this.endpoint = endpoint
        this.rooms = []
    }

    addRoom(roomObj) {
        this.rooms.push(roomObj)
    }
}

module.exports = Namespace