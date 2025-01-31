const mainPalete = { background: "grey", fallen:"red", active:"blue"};
const game = new gameManager(30, 30, 10, 20, mainPalete);
const basicShape = {pattern:[true,false,true,true,true,false],width:2}
var frame = 0;
var cell1 = new Shape(basicShape,0,0,generateShape,game);
cell1.draw();
function generateShape(){
  cell1 = new Shape(basicShape,0,0,generateShape,game);
}
function update(){
  game.drawBoard();
  if (frame%5==0){
    cell1.move(0,1);
  }
  cell1.draw();
  game.detectFullRow();
  frame++;
  
}
board[3][4] = 1
setInterval(update,100);