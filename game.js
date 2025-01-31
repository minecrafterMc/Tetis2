const mainPalete = { background: "grey", fallen:"red", active:"blue"};
const game = new gameManager(30, 30, 20, 30, mainPalete);
const basicShape = {pattern:[true,false,true,true,true,false],width:2}
var frame = 0;
var cell1 = new Shape(basicShape,0,0,generateShape,game);
cell1.draw();
function generateShape(reason){
  if (reason == "fall"){
  cell1 = new Shape(basicShape,0,0,generateShape,game);
  }
  else if (reason == "rotate"){
    cell1 = new Shape(arguments[1],arguments[2],arguments[3],generateShape,game);
  }
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
window.addEventListener("keydown", event => {
  if (event.key == "a") {
    cell1.move(-1, 0);
  }
});
window.addEventListener("keydown", event => {
  if (event.key == "d") {
    cell1.move(1, 0);
  }
});
window.addEventListener("keydown", event => {
  if (event.key == "s") {
    cell1.move(0, 1);

  }
});
window.addEventListener("keydown", event => {
  if (event.key == "ArrowLeft") {
    cell1.rotate("left");
  }
});
window.addEventListener("keydown", event => {
  if (event.key == "ArrowRight") {
    cell1.rotate("right");
  }
});