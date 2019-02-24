//The  Piece Consntructor function
function Piece(tetromino,color){
    this.tetromino=tetromino;
    this.color=color;
    
    this.tetrominoN=0; // We start from first pattern
    this.activeTetromino =this.tetromino[this.tetrominoN];
    
    //we need to control the pieces
    this.x=3;
    this.y=-2;
    }
 export default Piece;