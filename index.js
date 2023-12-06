const { Server } = require("socket.io");
const  {findUserBySocketId, toggleTurn}  = require("./utils");

const io = new Server({ cors:"*" });

let onlinePlayers  = [];

io.on("connection", (socket) => {
  // ...
  console.log("User :"+socket.id+" entered game");

  socket.on('onconnection',(name)=>{
    onlinePlayers.push({name:name,socket_id:socket.id});

    io.emit("getOnlinePlayers",onlinePlayers);
  })

  socket.on('disconnect',({oppositePlayer})=>{
    console.log("Disconnected : "+socket.id);
    onlinePlayers = onlinePlayers.filter((player)=>player.socket_id!==socket.id);
    
    io.emit("getOnlinePlayers",onlinePlayers);

  })

  socket.on('onGameQuit',({oppositePlayer})=>{

    if(oppositePlayer){
      console.log("Opposite player events for game quit")
      io.to(oppositePlayer.socketId).emit('gameQuit');
    }
  })

  socket.on('onplayerrequested',(socketId)=>{
    console.log("Selected player : "+socketId);
    console.log(findUserBySocketId(onlinePlayers,socketId));
    io.to(socketId).emit('gamerequest',{senderName:findUserBySocketId(onlinePlayers,socket.id)?.name,senderSocketId:socket.id});
  })

  socket.on('onaccepting',(socketId)=>{

    io.to(socketId).emit('requestaccepted',{senderName:findUserBySocketId(onlinePlayers,socket.id)?.name,senderSocketId:socket.id})
  })

  socket.on('onturnplay',({updatedBoard,oppositePlayer,turn,score})=>{
    console.log(`Turn of: ${socket.id} and oppositePlayer:`,oppositePlayer);
    console.log('Turn sign : '+turn);
    const newTurn = toggleTurn(turn);
    if(score){
      console.log("Clearedgame")
    io.to(oppositePlayer.socketId).emit('clearedall',updatedBoard,newTurn,score);
    }
    else{
    io.to(oppositePlayer.socketId).emit('turnplayed',updatedBoard,newTurn);
    }
  })

});

io.listen(4000);