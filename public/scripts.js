const socket = io('/')  
let nsSocket = ""

// listen for namespacelist, a list of all namespaces
socket.on('namespaceList', namespaceList => {
    let namespaceDiv = document.querySelector('.namespaces')
    namespaceList.forEach(namespace => {
        namespaceDiv.innerHTML += `<div class="namespace" namespace=${namespace.endpoint}><img src=${namespace.img}></img></div>`
    })
           
    //add clickListener to each namespace
    Array.from(document.getElementsByClassName('namespace')).forEach(namespaceElement => {
        //namespace endpont nikalo elemt ke namsspace attribute se
        namespaceElement.addEventListener('click', () => {
            const nsEndpoint = namespaceElement.getAttribute('namespace')
            console.log(`I am joining ${nsEndpoint} now`)
            joinNs(nsEndpoint)
        })
        
    })
    joinNs('/mozilla')
    
})



//Listen for namespace list,
 //add them to dom, and add click listeners 
 //you dont join that namespace here




//do baar dead end mistake -- socket se koi cheez aana is an asynchronous event
//toh agar  youre writing some code dependant on something jo socket se ayega, voh uss socket.on('', () => {ke andar likho})
//otherwise vo program pehle chal jaega poora and namespaces, rooms, currSocket ki value null leke
//2.turn HTMLcollection to array, using Array.from ES6 method, to be able to use all Array methods