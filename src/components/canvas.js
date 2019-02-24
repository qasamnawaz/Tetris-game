import React, { Component } from 'react'
import  randomPiece from './randomPiece';
import Piece from './pieceConstructor';
 class Canvas extends Component {
   state={
    row:20,
    col:10,
    sq:20,
    vacant:'white',
    board:[],
   }
  componentDidMount(){
     const {sq,row,col,vacant,board}=this.state;
     const scoreElement=document.getElementById('score');
  //draw square
 const cvs=document.getElementById('tetris');
 const ctx=cvs.getContext('2d');
  function drawSquare(x,y,color){
  ctx.fillStyle=color
  ctx.fillStyle=color;
  ctx.fillRect(x*sq,y*sq,sq,sq);
  ctx.strokeStyle="black";
  ctx.strokeRect(x*sq,y*sq,sq,sq);
  }
  // drawSquare(0,0,"red");
// Draw board
for(var r=0; r<row; r++){
  board[r]=[];
  for(var c=0;c<col;c++){
     board[r][c]=vacant;
  }
} 
//Draw board
function drawBoard(){
  for(var r=0; r<row; r++){
    for(var c=0;c<col;c++){
       drawSquare(c,r,board[r][c]);
    }
}
}
drawBoard();
let p =randomPiece();
// fill function
Piece.prototype.fill=function(color){
  for(var r=0; r<this.activeTetromino.length; r++){
    for(var c=0;c<this.activeTetromino.length;c++){
    // we draw only occupied squares
      if(this.activeTetromino[r][c]){
       drawSquare(this.x + c,this.y + r,color)
    }
    }
  }  
}
//draw  a piece on the board
Piece.prototype.draw=function(){
 this.fill(this.color)
}
// undraw a piece
Piece.prototype.unDraw=function(){
  this.fill(vacant)
}
// Move down the piece
Piece.prototype.moveDown=function(){
 if(!this.collision(0,1,this.activeTetromino)){
  this.unDraw();
  this.y++;
  this.draw();
 }else {
  // We lock the piece and generate a new one
  this.lock();
   p=randomPiece();
}
}  
// Move Right the Piece
Piece.prototype.moveRight=function(){
  if(!this.collision(1,0,this.activeTetromino)){
  this.unDraw();
  this.x++;
  this.draw();
  }
}
// Move Left the Piece
Piece.prototype.moveLeft=function(){
  if(!this.collision(-1,0,this.activeTetromino)){
  this.unDraw();
  this.x--;
  this.draw();
  }
}
// Rotate the Piece
Piece.prototype.rotate=function(){
  let nextPattern =  this.tetromino[(this.tetrominoN + 1)% this.tetromino.length];
 let kick =0;
 if(this.collision(0,0,nextPattern)){
   if(this.x > col/2){
     // its right wall
     kick =-1;  // we need to move the piece left
    }
   else {
     //its the left wall
     kick =1;  // we need to move the piece right

   }
 }
  if(!this.collision(kick,0,nextPattern)){
  this.unDraw();
  this.x +=kick;
  this.tetrominoN=(this.tetrominoN + 1)% this.tetromino.length; //(0+1)%4=>1
  this.activeTetromino = this.tetromino[this.tetrominoN]
  this.draw();
}
}
let score=0;
Piece.prototype.lock=function(){
  for(var r=0; r<this.activeTetromino.length; r++){
    for(var c=0;c<this.activeTetromino.length;c++){
    // we Skip the vacant squares
      if(!this.activeTetromino[r][c]){
        continue;
      }
      //Pieces to lock on the top the screen
      if(this.y + r < 0){
      document.getElementById('over').innerHTML=`Game Over <br> <button onclick={window.location.reload(false)}>Retry</button>`
        //Stop request animation frame
        gameOver=true;
        break;
      }
      // we lock the piece
      board[this.y+r][this.x+c] =this.color;
    }
  }
  // remove full rows
  for(r=0;r<row;r++){
    let isRowFull =true;
    for(c=0;c<col;c++){
      isRowFull=isRowFull && (board[r][c] !==vacant);
    }
    if(isRowFull){
      // if the row is full
      //we move down all the rows above it
      for( var y=r;y>1;y--){
        for(c=0;c<col;c++){
     board[y][c] =board[y-1][c];
        }
      }
      // the top row board[0][..] has no row above it
      for(c=0;c<col;c++){
        board[0][c] =vacant;
       }
         // increament score
         score +=10;  
    }
  } 
  // update the board
  drawBoard();
  //update the score
  scoreElement.innerHTML=score;

}    
// collision function
Piece.prototype.collision=function(x,y,piece){
  for(var r=0; r<piece.length; r++){
    for(var c=0;c<piece.length;c++){
    // if the square empty we skip it
    if(!piece[r][c]){
      continue;
    }
    // coordinates of the piece after the movement
    let newX=this.x + c + x;
    let newY=this.y + r + y;
  // Conditions
  if(newX<0 || newX>=col || newY>=row ){
     return true;
  }
  // skip newY < 0 board[-1] will crush the game
  if(newY <0){
    continue;
  }
  // Checkedif there is a locked piece already on the board
  if(board[newY][newX] !== vacant){
    return true;
  } 
  }
  }
  return false;
}
// Control the piece
document.addEventListener("keydown",CONTROL);
function CONTROL(event){
  if(event.keyCode === 37){
   p.moveLeft();
   dropStart =Date.now();
  }
  else if(event.keyCode === 38){
   p.rotate();
   dropStart =Date.now();
  }
  else if(event.keyCode === 39){
   p.moveRight();
   dropStart =Date.now();
  }
  else if(event.keyCode === 40){
   p.moveDown();
  }
}
// drop the piece every 1 sec
let dropStart =Date.now();
let gameOver=false;
function drop(){
  let now=Date.now();
  let delta = now-dropStart;
  if(delta>1000){
    p.moveDown();
    dropStart =Date.now();
  }
  if(!gameOver){
  requestAnimationFrame(drop);
  }
}
drop();
document.getElementById('up').addEventListener("click",()=>{
  p.rotate();
  dropStart =Date.now();
});
document.getElementById('down').addEventListener("click",()=>{
  p.moveDown();
  dropStart =Date.now();
});
document.getElementById('right').addEventListener("click",()=>{
  p.moveRight();
  dropStart =Date.now();
});
document.getElementById('left').addEventListener("click",()=>{
  p.moveLeft();
  dropStart =Date.now();
});

}
  render() {
    return (
      <div>
        <h3 style={{textAlign:'center',marginTop: '0'}}>Tetris Game</h3>
        <canvas id="tetris" height="400px" width="200px" ></canvas>
       <div className="cls0">
       <div className="score"> Score <br/>
       <div id="score" >0</div>  
       </div>  
       </div>  
       <div className="cls01">
       <table>
         <tbody>   
       <tr style={{textAlign:'center'}}>
       <td><i className="fas fa-arrow-up" id="up"></i></td>
       </tr>
       <tr>
      <td>   
       <i className="fas fa-arrow-left" style={{margin:'0 10px'}} id="left"></i>
        <i className="fas fa-arrow-right" style={{margin:'0 10px'}} id="right"></i>
        </td>
       </tr>
      <tr style={{textAlign:'center'}}> 
      <td>
       <i className="fas fa-arrow-down" id="down"></i>
       </td>
       </tr>
       </tbody>
       </table>
       </div>
       <div>
       <p id='over'></p>         
       </div>
      </div>
    )
  }
 }
//  <i class="fas fa-angle-left"> </i>
//  <i class="fas fa-angle-up"> </i>
//  <i class="fas fa-angle-down"> </i>
//  <i class="fas fa-angle-right"> </i>
export default Canvas;

