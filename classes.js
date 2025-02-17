//chatgpt's code for rotatung a 2d array
function rotateMatrix(matrix, direction = 'clockwise') {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Create a new empty matrix of the correct rotated size
  let newRows = cols; // Rows become columns after rotation
  let newCols = rows; // Columns become rows after rotation
  let rotated = Array.from({ length: newRows }, () => Array(newCols).fill(false));

  for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
          if (matrix[i][j]) { // Only rotate the "true" values
              let xNew, yNew;

              if (direction === 'clockwise') {
                  xNew = j;
                  yNew = newCols - 1 - i;
              } else { // Counterclockwise
                  xNew = newRows - 1 - j;
                  yNew = i;
              }

              rotated[xNew][yNew] = true;
          }
      }
  }

  return rotated;
}
function RandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const timerElement = document.getElementById("timer");
const moneyElement = document.getElementById("money");
const menuElement = document.getElementById("menu");
const LeftMenuElement = document.getElementById("menu-left");
const RightMenuElement = document.getElementById("menu-right");
const canvas = document.getElementById("canvas");
const leftMoveButton = document.getElementById("left-move-button");
const leftRotButton = document.getElementById("left-rot-button");
const rightMoveButton = document.getElementById("right-move-button");
const rightRotButton = document.getElementById("right-rot-button");
const ctx = canvas.getContext("2d");
const board = [];
class gameManager {
  constructor(cellWidth, cellHeight, boardWidth, boardHeight, colorPaletes) {
    //capitalised members store information

    this.CellWidth = cellWidth;
    this.CellHeight = cellHeight;
    this.BoardWidth = boardWidth;
    this.BoardHeight = boardHeight;
    this.ColorPaletes = colorPaletes;
    this.adjustCanvas();
    this.adjustBoardArray();
    this.drawBoard();
  }
  drawBoard(thisBoard = board) {
    ctx.fillStyle = this.ColorPaletes[currentPalete].background;
    ctx.fillRect(
      0,
      0,
      this.CellWidth * this.BoardWidth,
      this.CellHeight * this.BoardHeight
    );
    ctx.fillStyle = this.ColorPaletes[currentPalete].fallen;
    for (let i = 0; i < thisBoard.length; i++) {
      for (let j = 0; j < thisBoard[i].length; j++) {
        if (thisBoard[i][j] == 1 || thisBoard[i][j] == 2) {
          if (thisBoard[i][j] == 1) {
            ctx.fillStyle = this.ColorPaletes[currentPalete].fallen;
          }
          else if (thisBoard[i][j] == 2){
            ctx.fillStyle = this.ColorPaletes[currentPalete].trail;
          }
          ctx.fillRect(
            i * this.CellWidth,
            j * this.CellHeight,
            this.CellWidth,
            this.CellHeight
          );
        }
      }
    }
    document.body.style.backgroundColor = this.ColorPaletes[currentPalete].background;
    document.body.style.color = this.ColorPaletes[currentPalete].text;
  }
  adjustCanvas() {
    canvas.width = this.CellWidth * this.BoardWidth;
    canvas.height = this.CellHeight * this.BoardHeight;
  }
  adjustBoardArray() {
    for (let i = board.length; i < this.BoardWidth; i++) {
      board[i] = [];
    }
    for (let i = 0; i < this.BoardWidth; i++) {
      for (let j = board[i].length; j < this.BoardHeight; j++) {
        board[i][j] = 0;
      }
      board[i].length = this.BoardHeight;
    }
    board.length = this.BoardWidth;
  }
  resetBoard() {
    for (let i = 0; i < this.BoardWidth; i++) {
      for (let j = 0; j < this.BoardHeight; j++) {
        board[i][j] = 0;
      }
    }
  }
  detectFullRow() {
    let full = true;
    main: for (let i = 0; i < this.boardHeight; i++) {
      full = true;
      for (let j = 0; j < this.boardWidth; j++) {
        if (board[j][i] == 0) {
          full = false;
        }
      }
      if (full) {
        for (let j = 0; j < this.boardWidth; j++) {
            board[j][i] = 0;
        }
        money+=income;
        AbilityRegistries.run("onLineClear");
        break main;
      }
      full = true;
      for (let j = 0; j < this.boardWidth; j++) {
        if (board[j][i] == 1) {
          full = false;
        }
      }
      if (full) {
        for (let j = 0; j < this.boardWidth; j++) {
            board[j][i] = board[j][i-1];
            board[j][i - 1] = 0;
        }
      }
    }
  }
  
  set boardWidth(value) {
    this.BoardWidth = value;
    this.adjustBoardArray();
    this.adjustCanvas();
    this.drawBoard();
  }
  set boardHeight(value) {
    this.BoardHeight = value;
    this.adjustBoardArray();
    this.adjustCanvas();
    this.drawBoard();
  }
  set cellWidth(value) {
    this.CellWidth = value;
    this.adjustCanvas();
    this.drawBoard();
  }
  set cellHeight(value) {
    this.CellHeight = value;
    this.adjustCanvas();
    this.drawBoard();
  }
  get boardWidth() {
    return this.BoardWidth;
  }
  get boardHeight() {
    return this.BoardHeight;
  }
  get cellWidth() {
    return this.CellWidth;
  }
  get cellHeight() {
    return this.CellHeight;
  }
}
class Cell {
  constructor(x, y, onFall, GameManager) {
    this.bx = x;
    this.by = y;
    this.X = x * GameManager.CellWidth;
    this.Y = y * GameManager.CellHeight;
    this.game = GameManager;
    this.onFall = onFall;
  }
  draw() {
    ctx.fillStyle = this.game.ColorPaletes[currentPalete].active;
    ctx.fillRect(this.X, this.Y, this.game.CellWidth, this.game.CellHeight);
  }
  move(x, y) {
    let canMoveX = false;
    let canMoveY = false;
    if (this.bx < this.game.BoardWidth - 1) {
      this.bx += x;
      this.X = this.bx * this.game.CellWidth;
      canMoveX = true;
    }
    if (
      this.by < this.game.BoardHeight - 1 &&
      board[this.bx][this.by + 1] == 0
    ) {
      this.by += y;
      this.Y = this.by * this.game.CellHeight;
      canMoveY = true;
    } else {
      this.die();
    }
    return { x: canMoveX, y: canMoveY };
  }
  tryMove(x, y) {
    let canMoveX = false;
    let canMoveY = false;
    if (
      this.bx + x != this.game.boardWidth &&
      this.bx + x != -1 &&
      board[this.bx + x][this.by] == 0
    ) {
      canMoveX = true;
    }
    if (
      this.by < this.game.BoardHeight - 1 &&
      board[this.bx][this.by + y] == 0
    ) {
      canMoveY = true;
    }
    return { x: canMoveX, y: canMoveY };
  }
  forceMove(x, y) {
    this.bx += x;
    this.X = this.bx * this.game.CellWidth;
    this.by += y;
    this.Y = this.by * this.game.CellHeight;
  }
  die() {
    board[this.bx][this.by] = 1;
    this.onFall();
  }
  
  set x(value) {
    this.bx = value;
    this.X = this.bx * this.game.cellWidth;
  }
  set y(value) {
    this.by = value;
    this.Y = this.by * this.game.cellHeight;
  }
  get x() {
    return this.X;
  }
  get y() {
    return this.Y;
  }
}
class Shape {
  constructor(shape, x, y, onFall, gameManager) {
    this.originX = x;
    this.originY = y;
    this.shape = shape;
    this.shape.pattern2d = [];
    for (
      let i = 0;
      i < Math.ceil(this.shape.pattern.length / this.shape.width);
      i++
    ) {
      this.shape.pattern2d.push([]);
    }
    for (let i = 0; i < shape.pattern.length; i++) {
      this.shape.pattern2d[Math.floor(i / this.shape.width)][
        i % this.shape.width
      ] = this.shape.pattern[i];
    }
    this.game = gameManager;
    this.onFall = onFall;
    this.cells = [];
    for (let i = 0; i < shape.pattern.length; i++) {
      if (this.shape.pattern[i]) {
        this.cells.push(
          new Cell(
            x + (i % this.shape.width),
            y + Math.floor(i / this.shape.width),
            () => {
              for (let i = 0; i < this.cells.length; i++) {
                board[this.cells[i].bx][this.cells[i].by] = 1;
              }
              this.onFall("fall");
            },
            this.game
          )
        );
      }
    }
    this.game.drawBoard(this.drawpreview());
    this.draw();
  }
  draw() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].draw();
    }
  }
  drawpreview() {
    let i = 0;
    let newBoard = JSON.parse(JSON.stringify(board));
    let found = false;
    while (!found){
      for (let j = 0; j < this.cells.length; j++) {
        if (board[this.cells[j].bx][this.cells[j].by + i] == 1 || this.cells[j].by + i >= this.game.boardHeight){
          found = true;
          break;
        }
      }
      i++;
    }
    for (let j = 0; j < this.cells.length; j++) {
      newBoard[this.cells[j].bx][this.cells[j].by + i-2] = 2;
    }
   return newBoard;
  }
  move(x, y) {
    let canMove = true;
    for (let i = 0; i < this.cells.length; i++) {
      if (!this.cells[i].tryMove(x, y).x) {
        canMove = false;
      }
      if (!this.cells[i].tryMove(x, y).y) {
        this.cells[i].die();
      }
    }
    if (canMove) {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].forceMove(x, y);
      }
      this.originX += x;
      this.originY += y;
    }
    this.game.drawBoard(this.drawpreview());
    this.draw();
  }
  rotate(side) {
    let newPattern = [];
    let new2dPattern = [];
    if (side == "right") {
      new2dPattern = rotateMatrix(this.shape.pattern2d);
    } else {
      new2dPattern = rotateMatrix(this.shape.pattern2d,"counterclockwise");
    }
    for (let i = 0; i < new2dPattern.length; i++) {
      newPattern = [...newPattern, ...new2dPattern[i]];
    }
    let newWidth = new2dPattern[0].length;
    let canRotate = true;
    for (let i = 0; i < newPattern.length; i++) {
      if (
        board[this.originX + (i % newWidth)][
          this.originY + Math.floor(i / newWidth)
        ] == 1 || this.originY + Math.floor(i / newWidth) >= this.game.boardHeight
      ) {
        canRotate = false;
      }
    }
    if (canRotate) {
      this.onFall(
        "rotate",
        { pattern: newPattern, width: newWidth, name: this.shape.name },
        this.originX,
        this.originY
      );
    }
  }
}
class Item{
  constructor(id, name, description, price, cooldown, onActivate, onBuy, customInventoryText){
    this.name = name;
    this.description = description;
    this.price = price;
    this.cooldown = cooldown;
    this.onActivate = onActivate;
    this.owned = false;
    this.lastUsed = -5;
    this.onBuy = onBuy;
    this.customInventoryText = customInventoryText;
    this.id = id;
  }
  buy(){
    if (money >= this.price){
      money -= this.price;
      this.owned = true;
      inventory[this.id] = this;
      this.onBuy();
      return {success: true, message: "Item bought"};
    }
    else{
      return {success: false, message: "Not enough money"};
    }
  }
}
class ItemCountable extends Item{
  constructor(id, name, description, price, cooldown, onActivate, onBuy, customInventoryText){
    super(id, name, description, price, cooldown, onActivate, onBuy, customInventoryText);
    this.count = 0;
  }
  buy(){
    console.log(this);
    if (money >= this.price){
      money -= this.price;
      this.owned = true;
      this.onBuy();
      if (inventory[this.id] == undefined){
        inventory[this.id] = this;
      }
      inventory[this.id].count++;
      return {success: true, message: "Item bought"};
    }
    else{
      return {success: false, message: "Not enough money"};
    }
  }
}
class Ability{
  constructor(id,name, description, price, cooldown, onBuy, onActivate, registry){
    this.name = name;
    this.description = description;
    this.price = price;
    this.cooldown = cooldown;
    this.onActivate = onActivate;
    this.onBuy = onBuy;
    this.registry = registry;
    this.owned = false;
    this.lastUsed = -5;
    this.id = id;

  }
  buy(){
    if (money >= this.price){
      money -= this.price;
      this.onBuy();
      this.registry[this.id] = this;
      return {success: true, message: "Ability bought"};
    }
    else{
      return {success: false, message: "Not enough money"};
    }
  }
}
class AbilityCountable extends Ability{
  constructor(id, name, description, price, cooldown, onBuy, onActivate, registry){
    super(id,name, description, price, cooldown, onBuy, onActivate, registry);
    this.count = 0;
  }
  buy(){
    if (money >= this.price){
      money -= this.price;
      this.onBuy();
      this.registry[this.id] = this;
      this.registry[this.id].count++;
      return {success: true, message: "Ability bought"};
    }
    else{
      return {success: false, message: "Not enough money"};
    }
  }
}