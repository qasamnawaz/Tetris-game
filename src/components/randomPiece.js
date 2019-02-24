import PIECES from './pieces';
import Piece from './pieceConstructor';
// Generate random fraction pieces

const randomPiece=()=>{
    let r = Math.floor(Math.random()*PIECES.length);
    return new Piece(PIECES[r][0],PIECES[r][1]);
  
  }
export default randomPiece;