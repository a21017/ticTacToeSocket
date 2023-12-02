exports.findUserBySocketId = (array,socketId)=>{

    return array.find((ele)=>ele.socket_id===socketId);
};

exports.toggleTurn = (turn)=>{

    const nTurn =  turn==='X'?'O':'X';
    console.log(nTurn);
    return nTurn;
}