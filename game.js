if (sessionStorage.getItem("gdata")) {
  var gameData = JSON.parse(sessionStorage.getItem("gdata"));
} else {
  location.href = "index.html";
}
const paletes = gameData.colors;
var currentPalete = 0;
const blocks = gameData.blocks;
const game = new gameManager(30, 30, 10, 20, paletes);
const AbilityRegistries = {
  onLineClear: [],
  onBlockFall: [],
  onitemUse: [],
  passive: [],
};
const Items = [
  new Item("clear","clears the board",10,10,()=>{game.resetBoard()}),
]
var frame = 0;
var timer = 0;
var money = 0;
var wave = 0;
var timeLimit = 10;
var income = 1;
var menuOpen = false;
var pause = false;
var menuPointer = 0;
var menu = 0;
var shopOpen = false;
var menuChoices = [];
var inventory = [Items[0]];
var cell1 = new Shape(
  blocks[RandomInt(0, blocks.length - 1)],
  0,
  0,
  generateShape,
  game
);
cell1.draw();
function generateShape(reason) {
  if (reason == "fall") {
    cell1 = new Shape(
      blocks[RandomInt(0, blocks.length - 1)],
      0,
      0,
      generateShape,
      game
    );
  } else if (reason == "rotate") {
    cell1 = new Shape(
      arguments[1],
      arguments[2],
      arguments[3],
      generateShape,
      game
    );
  }
}
function update() {
  if (!pause) {
    game.drawBoard();
    if (frame % 5 == 0) {
      cell1.move(0, 1);
    }
    if (frame % 10 == 0) {
      timer++;
      timerElement.innerHTML = timer;
    }
    cell1.draw();

    game.detectFullRow();

    frame++;
  }
}
setInterval(update, 100);
window.addEventListener("keydown", (event) => {
  if (event.key == "a") {
    if (!menuOpen) {
      cell1.move(-1, 0);
    }
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key == "d") {
    if (!menuOpen) {
      cell1.move(1, 0);
    }
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key == "s") {
    if (menuOpen) {
      navigateMenu("down");
    } else {
      cell1.move(0, 1);
    }
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key == "w") {
    if (menuOpen) {
      navigateMenu("up");
    }
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key == "ArrowLeft") {
    cell1.rotate("left");
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key == "ArrowRight") {
    cell1.rotate("right");
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key == "e") {
    if (!menuOpen) {
    pause = !pause;
    menuOpen = !menuOpen;
    menu = 0;
    switchMenu();
    }
    else {
      navigateMenu("select");
    }
  }
});
function switchMenu() {
  if (menuOpen) {
    menuElement.style.display = "block";
    menuPointer = 0;
    BuildMenu();
  } else {
    menuElement.style.display = "none";
  }
}
function BuildMenu() {
  menuElement.innerHTML = "";
  if (menu == 0) {
    menuChoices = [["Resume"], ["Inventory"], ["Shop"], ["colors"]];
    for (let i = 0; i < menuChoices.length; i++) {
      menuChoices[i].push(document.createElement("div"));
      menuChoices[i][1].className = i==2 ? (shopOpen ? "menu-choice" : "menu-choice-inactive") : "menu-choice";
      menuChoices[i].push(() => {
        if (i == 0) {
          menuOpen = false;
          pause = false;
          switchMenu();
        }
        menu = i;
        switchMenu();
      });
      menuChoices[i].push(i==2 ? shopOpen : true);
      menuChoices[i][1].innerHTML = menuChoices[i][0];
      menuElement.appendChild(menuChoices[i][1]);
    }
  }
  else if(menu == 1) {
    menuChoices = [["Back",document.createElement("div"),()=>{menu = 0;switchMenu();},true]];
    menuChoices[0][1].innerHTML = menuChoices[0][0];
    menuChoices[0][1].className = "menu-choice";
    menuElement.appendChild(menuChoices[0][1]);
    for (let i = 0; i < inventory.length; i++) {
      menuChoices.push([inventory[i].name]);
      menuChoices[i+1].push(document.createElement("div"));
      menuChoices[i+1][1].className = "menu-choice";
      menuChoices[i+1].push(() => {
        if (!shopOpen) {
          inventory[i].onActivate();
        }
      });
      menuChoices[i+1].push(!shopOpen);
      menuChoices[i+1][1].innerHTML = menuChoices[i+1][0];
      menuElement.appendChild(menuChoices[i][1]);
    }
  }
  menuChoices[menuPointer][1].id = "menu-selected";
}
function navigateMenu(action) {
  if (action == "up") {
    if (menuPointer > 0) {
      menuChoices[menuPointer][1].id = "";
      menuPointer--;
      menuChoices[menuPointer][1].id = "menu-selected";
    }
  }
  if (action == "down") {
    if (menuPointer < menuChoices.length-1) {
    menuChoices[menuPointer][1].id = "";
    menuPointer++;
    menuChoices[menuPointer][1].id = "menu-selected";
    }
  }
  if (action == "select") {
    if (menuChoices[menuPointer][3]) {
      menuChoices[menuPointer][2]();
    }
  }
}
