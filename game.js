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
  new Ability("increase income","adds a new column to the board and adds 1 to your income",10,10,()=>{game.boardWidth += 1;income+=1;this.owned = false;},()=>{},AbilityRegistries.passive),
  new Ability("expand timer","makes the time limit longer by 10 seconds",5,10,()=>{timeLimit += 10;this.owned = false;},()=>{},AbilityRegistries.passive),
]
var frame = 0;
var timer = 0;
var money = 0;
var wave = 0;
var timeLimit = 30;
var income = 1;
var menuOpen = false;
var pause = false;
var menuPointer = 0;
var menu = 0;
var shopOpen = false;
var menuChoices = [];
var inventory = [Items[0]];
var cell1 = new Shape(
  blocks[0],
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
      timerElement.innerHTML = timer + "/" + timeLimit;
      if (timer == timeLimit) {
        console.log("wave");
        wave++;
        timer = 0;
        //waveElement.innerHTML = wave;
        pause = true;
        menuOpen = true;
        shopOpen = true;
        switchMenu(); 
      }
    }
    cell1.draw();
    
    moneyElement.innerHTML = money+"$";
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
    BuildRightMenu(0);
  } else {
    menuElement.style.display = "none";
  }
}
function BuildRightMenu(menuId) {
  RightMenuElement.innerHTML = "";
  if (menuId == 0) {
    
      RightMenuElement.innerHTML = "<h1>wave: " + wave + "<br>money: " + money+"$</h1><br>income per line cleared: " +income + "$";
    
  }
  if (menuId == 1) {
    
    RightMenuElement.innerHTML = "<h1>Access your items</h1><br>";
  
}
if (menuId == 2) {
    
  RightMenuElement.innerHTML = "<h1>Shop for items<br><br>" + (shopOpen ? "Money: " + money +"$</h1>" : "You can access the shop between waves</h1>");

}
if (menuId == 3) {
    
  RightMenuElement.innerHTML = "<h1>Change your color palete<br><br>additional paletes available in the shop</h1>";

}
if (menuId == 4) {
    
  RightMenuElement.innerHTML = "<h1>Back</h1>";

}
if (menuId == 5) {
      
    RightMenuElement.innerHTML = "<h1 class='colorDisplay' style='background-color: "+paletes[menuPointer-1].active+"; color: "+paletes[menuPointer-1].text+"'>Shape color</h1><br>";
    RightMenuElement.innerHTML += "<h1 class='colorDisplay' style='background-color: "+paletes[menuPointer-1].background+"; color: "+paletes[menuPointer-1].text+"'>Background color</h1><br>";
    RightMenuElement.innerHTML += "<h1 class='colorDisplay' style='background-color: "+paletes[menuPointer-1].fallen+"; color: "+paletes[menuPointer-1].text+"'>fallen blocks</h1><br>";
}
if (menuId == 6) {

  RightMenuElement.innerHTML = "<h1 class='itemDisplay'>"+inventory[menuPointer-1].name+"</h1><br>";
  RightMenuElement.innerHTML += "<h1 class='itemDisplay'>"+inventory[menuPointer-1].description+"</h1><br>";
  RightMenuElement.innerHTML += "<h1 class='itemDisplay'>Cooldown: "+(timer- inventory[menuPointer-1].lastUsed < inventory[menuPointer-1].cooldown ? inventory[menuPointer-1].cooldown - (timer - inventory[menuPointer-1].lastUsed) : "0")+"</h1><br>";
}
if (menuId == 7) {

  RightMenuElement.innerHTML = "<h1 class='itemDisplay'>Money:"+money+"$</h1><br><br><br>";
  RightMenuElement.innerHTML += "<h1 class='itemDisplay'>"+Items[menuPointer-1].name+"</h1><br>";
  RightMenuElement.innerHTML += "<h1 class='itemDisplay'>"+Items[menuPointer-1].description+"</h1><br>";
  RightMenuElement.innerHTML += "<h1 class='itemDisplay'>Cooldown: "+Items[menuPointer-1].cooldown+"</h1><br>";
  RightMenuElement.innerHTML += "<h1 class='itemDisplay'>Price: "+Items[menuPointer-1].price+"$</h1><br>";
}
}
function BuildMenu() {
  LeftMenuElement.innerHTML = "";
  if (menu == 0) {
    menuChoices = [["Resume"], ["Inventory"], ["Shop"], ["colors"]];
    let rightMenus = [0, 1, 2, 3];
    for (let i = 0; i < menuChoices.length; i++) {
      menuChoices[i].push(document.createElement("div"));
      menuChoices[i][1].className = i==2 ? (shopOpen ? "menu-choice" : "menu-choice-inactive") : "menu-choice";
      menuChoices[i].push(() => {
        if (i == 0) {
          menuOpen = false;
          pause = false;
          switchMenu();
          if(shopOpen) {
            shopOpen = false;
            game.resetBoard();
            switchMenu();
          }
        }
        menu = i;
        switchMenu();
      });
      menuChoices[i].push(i==2 ? shopOpen : true);
      menuChoices[i][1].innerHTML = menuChoices[i][0];
      menuChoices[i][4] = rightMenus[i];
      LeftMenuElement.appendChild(menuChoices[i][1]);
    }
  }
  else if(menu == 1) {
    menuChoices = [["Back",document.createElement("div"),()=>{menu = 0;switchMenu();},true,4]];
    menuChoices[0][1].innerHTML = menuChoices[0][0];
    menuChoices[0][1].className = "menu-choice";
    LeftMenuElement.appendChild(menuChoices[0][1]);
    for (let i = 0; i < inventory.length; i++) {
      menuChoices.push([inventory[i].name]);
      menuChoices[i+1].push(document.createElement("div"));
      menuChoices[i+1][1].className = shopOpen ? "menu-choice-inactive" : "menu-choice";
      menuChoices[i+1].push(() => {
        if (!shopOpen) {
          inventory[i].onActivate();
          inventory[i].lastUsed = timer;
          pause = false;
          menuOpen = false;
          switchMenu();
        }
      });
      menuChoices[i+1].push(!shopOpen);
      menuChoices[i+1][1].innerHTML = menuChoices[i+1][0];
      menuChoices[i+1][4] = 6;
      LeftMenuElement.appendChild(menuChoices[i+1][1]);
    }
  }
  else if(menu == 2){
    menuChoices = [["Back",document.createElement("div"),()=>{menu = 0;switchMenu();},true,4]];
    menuChoices[0][1].innerHTML = menuChoices[0][0];
    menuChoices[0][1].className = "menu-choice";
    LeftMenuElement.appendChild(menuChoices[0][1]);
    for (let i = 0; i < Items.length; i++) {
      menuChoices.push([Items[i].name + (Items[i].owned ? " (SOLD OUT)" : " ("+Items[i].price+"$)")]);
      menuChoices[i+1].push(document.createElement("div"));
      menuChoices[i+1][1].className =  "menu-choice";
      menuChoices[i+1].push(() => {
        Items[i].buy();
      });
      menuChoices[i+1].push(!Items[i].owned);
      menuChoices[i+1][1].innerHTML = menuChoices[i+1][0];
      menuChoices[i+1][4] = 7;
      LeftMenuElement.appendChild(menuChoices[i+1][1]);
    }
  }
  else if(menu == 3){
    menuChoices = [["Back",document.createElement("div"),()=>{menu = 0;switchMenu();},true,4]];
    menuChoices[0][1].innerHTML = menuChoices[0][0];
    menuChoices[0][1].className = "menu-choice";
    LeftMenuElement.appendChild(menuChoices[0][1]);
    for (let i = 0; i < paletes.length; i++) {
      menuChoices.push([paletes[i].name]);
      menuChoices[i+1].push(document.createElement("div"));
      menuChoices[i+1][1].className =  "menu-choice";
      menuChoices[i+1].push(() => {
        if (!shopOpen) {
          currentPalete = i;
          pause = false;
          menuOpen = false;
          switchMenu();
        }
      });
      menuChoices[i+1].push(!shopOpen);
      menuChoices[i+1][1].innerHTML = menuChoices[i+1][0];
      menuChoices[i+1][4] = 5;
      LeftMenuElement.appendChild(menuChoices[i+1][1]);
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
  BuildRightMenu(menuChoices[menuPointer][4]);
}
