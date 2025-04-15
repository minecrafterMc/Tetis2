if (sessionStorage.getItem("gdata")) {
  var gameData = JSON.parse(sessionStorage.getItem("gdata"));
} else {
  location.href = "index.html";
}
const paletes = gameData.colors;
var currentPalete = 0;
const blocks = gameData.blocks;
const game = new gameManager(30, 30, 10, 20, paletes);
game.quotaEnabled = true;
const AbilityRegistries = {
  onLineClear: [],
  onBlockFall: [],
  onitemUse: [],
  passive: [],
  run: (cat) => {
    let iterable = [];
    let keys = Object.keys(AbilityRegistries[cat]);
    for (let i = 0; i < keys.length; i++) {
      iterable[i] = AbilityRegistries[cat][keys[i]];
    }
    for (let i = 0; i < iterable.length; i++) {
      iterable[i].onActivate();
    }
  }
};

const RegisteredItems = [
  
  
  new Item(
    0,
    "clear",
    "clears the board",
    10,
    10,
    () => {
      game.resetBoard();
    },
    () => {},
    () => {
      return "";
    }
  ),
  new Ability(
    0,
    "increase income",
    "adds a new column to the board and adds 1 to your income",
    10,
    10,
    () => {
      game.boardWidth += 1;
      income += 1;
      this.owned = false;
    },
    () => {},
    AbilityRegistries.passive
  ),
  new Ability(
    0,
    "expand timer",
    "makes the time limit longer by 10 seconds",
    5,
    10,
    () => {
      timeLimit += 10;
      this.owned = false;
    },
    () => {},
    AbilityRegistries.passive
  ),
  new ItemCountable(
    1,
    "Gold",
    "Gold is a safe investment. it doesen't disapear after death, and can be sold for half of its price",
    2,
    0,
    () => {
      money += 1;
    },
    () => {},
    () => {
      return "";
    }
  ),
  new Ability(1, "clear", "clears the screen whenever a line is cleared", 1, 0, () => {}, () => { game.resetBoard() }, AbilityRegistries.onLineClear),
  new Item(2, "TnT", "blows up", 1, 5, () => {
    let sy = cell1.originy + Math.floor(cell1.shape.pattern2d.length / 2);
    let sx = cell1.originx + Math.floor(cell1.shape.width / 2);
    for (let i = 0; i < 9; i++) {
      board[sx + (1 - Math.floor(i % 3))][sy + (1 - Math.floor(i / 3))] = 0;
    }
  }, () => {}, () => {})
  
];
var Items = [
  
]
var quotas = [
  10,
  40,
  80,
  100,
  150,
  200
]
var mobile = navigator.appVersion.indexOf("Android") != -1 || navigator.appVersion.indexOf("ios") != -1;
var lastFrame = Date.now();
var frame = 0;
var inputFrame = 0;
var fastFrame = 0;
var timer = 0;
var speed = 4;
var fastUpdateId;
var money = 0;
var wave = 0;
var timeLimit = 30;
var income = 1;
var legacyMode = gameData.legacy;
var menuBlocked = false;
var menuOpen = false;
var pause = false;
var menuPointer = 0;
var menu = 0;
var tutorialStep = 0;
var shopOpen = false;
var menuChoices = [];
var shapeSpawnPosition = 0;
var inventory = {};
var inventoryIterable = [];
const pressedKeys = {
  "a": false,
  "d": false,
  "arrowLeft": false,
  "arrowRight": false
  
}

if (localStorage.getItem("playedTetis2Tutorial") == null){
  menu = -1;
  pause = true;
  menuOpen = true;
  switchMenu();
  BuildRightMenu(-1);
}
function updateInventoryIterable() {
  inventoryIterable = [];
  let keys = Object.keys(inventory);
  for (let i = 0; i < keys.length; i++) {
    inventoryIterable.push(inventory[keys[i]]);
  }
}
var cell1 = new Shape(blocks[0], 0, 0, generateShape, game);
cell1.draw();

function generateShape(reason) {
  if (reason == "fall") {
    AbilityRegistries.run("onBlockFall");
    cell1 = new Shape(
      blocks[RandomInt(0, blocks.length - 1)],
      Math.floor(game.boardWidth / 2),
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
  clearInterval(fastUpdateId);
}

function update() {
  if (!pause) {
    game.drawBoard(cell1.drawpreview());
    if (frame % speed == 0) {
      cell1.move(0, 1);
      cell1.drawpreview();
    }
    if (inputFrame > 0){
      if (pressedKeys.a){
        if (!menuOpen) {
      cell1.move(-1, 0);
    }
      }
      if (pressedKeys.d){
        if (!menuOpen) {
      cell1.move(1, 0);
    }
      }
      if (pressedKeys.arrowLeft){
        if (!menuOpen) {
      cell1.rotate("left");
    }
      }
      if (pressedKeys.arrowRight){
        if (!menuOpen) {
      cell1.rotate("right");
    }
      }
    }
    if (frame % 20 == 0) {
      timer++;
      if (!legacyMode){
      timerElement.innerHTML = timer +"/" + timeLimit;}
      else {
        timerElement.innerHTML = timer;
      }
      if (timer == timeLimit && !legacyMode) {
        wave++;
        timer = 0;
        pause = true;
        menuOpen = true;
        shopOpen = true;
        if (game.quotaEnabled && wave %5 == 0 && wave != 0){
          if (money > quotas[(wave / 5) - 1]){
            money -= quotas[(wave / 5) - 1];
          }
          else{
            game.loose();
          }
        }
        if (gameData.tutorialEnabled) {
          if (eval(gameData.tutorial[tutorialStep].condition)) {
            
            if (gameData.tutorial[tutorialStep+1].appear == "clearWave"){
          tutorialStep++;}
            buildTutorial("clearWave");
          }
        }
        generateShop();
        switchMenu();
      }
    }
    if (frame % 2 == 0) {
      if (leftMoveButton.pressed) {
        if (!menuOpen) {
          cell1.move(-1, 0);
        }
      }
    }
    cell1.draw();
    if (!legacyMode){
    moneyElement.innerHTML = money + "$<br>";
      
    }
    if (frame % Math.ceil(speed / 3) == 0) {
      game.detectFullRow();
      game.detectFullBoard();
    }
    
    frame++;
    inputFrame++;
  }
}

function fastUpdate() {
  if (!pause) {
    if (fastFrame % speed == 0) {
      cell1.move(0, 1);
      cell1.drawpreview();
    }
    game.drawBoard(cell1.drawpreview());
    cell1.draw();
    fastFrame++;
  }
}
setInterval(update, 50);
window.addEventListener("keydown", (event) => {
  if (event.key == "a") {
    pressedKeys.a = true;
    if (!menuOpen) {
      cell1.move(-1, 0);
      inputFrame = -2;
    }
  }
});
window.addEventListener("keyup", (event) => {
  if (event.key == "a") {
    pressedKeys.a = false;
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key == "d") {
    pressedKeys.d = true;
    if (!menuOpen) {
      cell1.move(1, 0);
      inputFrame = -2;
    }
  }
});
window.addEventListener("keyup", (event) => {
  if (event.key == "d") {
    pressedKeys.d = false;
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key == "s") {
    if (menuOpen) {
      navigateMenu("down");
    } else {
      cell1.moveDown();
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
    pressedKeys.arrowLeft = true;
    if (!menuOpen) {
      cell1.rotate("left");
      inputFrame = -2;
    }
  }
});
window.addEventListener("keyup", (event) => {
  if (event.key == "ArrowLeft") {
    pressedKeys.arrowLeft = false;
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key == "ArrowRight") {
    pressedKeys.arrowRight = true;
    if (!menuOpen) {
      cell1.rotate("right");
      inputFrame = -2;
    }
  }
});
window.addEventListener("keyup", (event) => {
  if (event.key == "ArrowRight") {
    pressedKeys.arrowRight = false;
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key == "e") {
    if (!menuOpen) {
      pause = !pause;
      menuOpen = !menuOpen;
      menu = 0;
      switchMenu();
    } else {
      navigateMenu("select");
    }
  }
});

function generateShop() {
  Items = [];
  for (let i = 0; i < 4; i++) {
    let item;
    do{ 
    item = RegisteredItems[RandomInt(0, RegisteredItems.length - 1)];
    } while(Items.includes(item));
    Items[i] = item;
  }
}

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

function buildTutorial(close) {
  if (gameData.tutorialEnabled) {
    if (tutorialStep === 0) {
      TutorialElement.style.display = "block";
      TutorialElement.innerHTML = gameData.tutorial[0].text;
      eval(gameData.tutorial[0].action);
      
    }
    
    else {
      console.log(close, gameData.tutorial[tutorialStep])
      if (gameData.tutorial[tutorialStep].appear == close) {
        console.log("test")
        TutorialElement.style.display = "block";
        TutorialElement.innerHTML = gameData.tutorial[tutorialStep].text;
        eval(gameData.tutorial[tutorialStep].action);
      }
    }
    TutorialElement.onclick = () => {
      if (eval(gameData.tutorial[tutorialStep].condition)) {
        eval(gameData.tutorial[tutorialStep].afterAction);
        TutorialElement.style.display = "none";
        if (tutorialStep != gameData.tutorial.length -1){
        if (gameData.tutorial[tutorialStep + 1].appear == "auto") {
          tutorialStep++;
          buildTutorial("auto");
        }
      }
      else{
        gameData.tutorialEnabled = false;
        localStorage.setItem("playedTetis2Tutorial",true)
      }
      }
      
    }
    
  }
}

function BuildRightMenu(menuId) {
  updateInventoryIterable();
  RightMenuElement.innerHTML = "";
  if (menuId == -1){
    RightMenuElement.innerHTML = "<h3>you haven't played the tutorial yet. I really recommend playing it to understand how to play the game.<br><br>Would you like to play the tutorial?<br><br>(you can always replay the tutorial from the main menu)</h>"
  }
  if (menuId == 0) {
    RightMenuElement.innerHTML =
      "<h1>wave: " +
      wave +
      "<br>money: " +
      money +
      "$</h1><br>income: " +
      income +
      "$";
  }
  if (menuId == 1) {
    RightMenuElement.innerHTML = "<h1>Access your items</h1><br>";
  }
  if (menuId == 2) {
    RightMenuElement.innerHTML =
      "<h1>Shop for items<br><br>" +
      (shopOpen ?
        "Money: " + money + "$</h1>" :
        "You can access the shop between waves</h1>");
  }
  if (menuId == 3) {
    RightMenuElement.innerHTML =
      "<h1>Change your color palete<br><br>additional paletes available in the shop</h1>";
  }
  if (menuId == 5) {
    RightMenuElement.innerHTML = "<h1>Back</h1>";
  }
  if (menuId == 6) {
    RightMenuElement.innerHTML =
      "<h1 class='colorDisplay' style='background-color: " +
      paletes[menuPointer - 1].active +
      "; color: " +
      paletes[menuPointer - 1].text +
      "'>Shape color</h1><br>";
    RightMenuElement.innerHTML +=
      "<h1 class='colorDisplay' style='background-color: " +
      paletes[menuPointer - 1].background +
      "; color: " +
      paletes[menuPointer - 1].text +
      "'>Background color</h1><br>";
    RightMenuElement.innerHTML +=
      "<h1 class='colorDisplay' style='background-color: " +
      paletes[menuPointer - 1].fallen +
      "; color: " +
      paletes[menuPointer - 1].text +
      "'>fallen blocks</h1><br>";
    RightMenuElement.innerHTML +=
      "<h1 class='colorDisplay' style='background-color: " +
      paletes[menuPointer - 1].trail +
      "; color: " +
      paletes[menuPointer - 1].text +
      "'>fall preview</h1><br>";
  }
  if (menuId == 7) {
    RightMenuElement.innerHTML =
      "<h1 class='itemDisplay'>" +
      inventoryIterable[menuPointer - 1].name +
      "</h1><br>";
    RightMenuElement.innerHTML +=
      "<h1 class='itemDisplay'>" +
      inventoryIterable[menuPointer - 1].description +
      "</h1><br>";
    if (inventoryIterable[menuPointer - 1].cooldown > 0) {
      RightMenuElement.innerHTML +=
        "<h1 class='itemDisplay'>Cooldown: " +
        (timer - inventoryIterable[menuPointer - 1].lastUsed <
          inventoryIterable[menuPointer - 1].cooldown ?
          inventoryIterable[menuPointer - 1].cooldown -
          (timer - inventoryIterable[menuPointer - 1].lastUsed) :
          "0") +
        "</h1><br>";
    }
    if (inventoryIterable[menuPointer - 1] instanceof ItemCountable) {
      RightMenuElement.innerHTML +=
        "<h1 class='itemDisplay'>Owned: " +
        inventoryIterable[menuPointer - 1].count +
        "</h1><br>";
    }
    if (inventoryIterable[menuPointer - 1].customInventoryText() != undefined) {
      RightMenuElement.innerHTML +=
        "<h1 class='itemDisplay'>" +
        inventoryIterable[menuPointer - 1].customInventoryText() +
        "</h1><br>";
      
    }
  }
  if (menuId == 8) {
    RightMenuElement.innerHTML =
      "<h1 class='itemDisplay'>Money:" + money + "$</h1><br><br><br>";
    RightMenuElement.innerHTML +=
      "<h1 class='itemDisplay'>" + Items[menuPointer - 1].name + "</h1><br>";
    RightMenuElement.innerHTML +=
      "<h1 class='itemDisplay'>" +
      Items[menuPointer - 1].description +
      "</h1><br>";
    RightMenuElement.innerHTML +=
      "<h1 class='itemDisplay'>Cooldown: " +
      Items[menuPointer - 1].cooldown +
      "</h1><br>";
    RightMenuElement.innerHTML +=
      "<h1 class='itemDisplay'>Price: " +
      Items[menuPointer - 1].price +
      "$</h1><br>";
    if (Items[menuPointer - 1] instanceof ItemCountable) {
      RightMenuElement.innerHTML +=
        "<h1 class='itemDisplay'>Owned: " +
        Items[menuPointer - 1].count +
        "</h1><br>";
    }
  }
  if (menuId == 9) {
    RightMenuElement.innerHTML = "<h1>Info about current quota</h1><br>";
    let currentQuota = Math.floor(wave / 5);
    RightMenuElement.innerHTML += "<h2>Current quota: " + currentQuota;
    RightMenuElement.innerHTML += "<br>due by wave " + 5 * (currentQuota + 1);
    RightMenuElement.innerHTML += "<br>amount to pay: " + quotas[currentQuota] + "$";
    RightMenuElement.innerHTML += "<br>payment will be taken automaticlly</h2>"
  }
}

function BuildMenu() {
  updateInventoryIterable();
  LeftMenuElement.innerHTML = "";
  if (menu == -1){
    menuChoices = [["yes"],["no"]];
    let rightMenus = [-1,-1];
    for (let i = 0; i < menuChoices.length; i++) {
  menuChoices[i].push(document.createElement("div"));
  menuChoices[i][1].className ="menu-choice";
  menuChoices[i].push(() => {
    if (i == 0){
      gameData.tutorialEnabled = true;
      sessionStorage.setItem("gdata",JSON.stringify(gameData));
      
      location.reload();
    }
      menuOpen = false;
      pause = false;
    switchMenu();
    buildTutorial();
    localStorage.setItem("playedTetis2Tutorial",true);
  });
  menuChoices[i].push(true);
  menuChoices[i][1].innerHTML = menuChoices[i][0];
  menuChoices[i][4] = rightMenus[i];
  menuChoices[i][1].onclick = () => {
    if (mobile) {
      if (menuPointer != i) {
        menuPointer = i;
        BuildRightMenu(menuChoices[i][4]);
        navigateMenu("update");
      }
      else {
        if (menuChoices[i][3]) {
          menuChoices[i][2]();
        }
      }
    }
    else {
      if (menuChoices[i][3]) {
        menuChoices[i][2]();
      }
    }
  };
  menuChoices[i][1].onmousemove = () => {
    if (!mobile) {
      
      menuPointer = i;
      navigateMenu("update");
    }
  };
  LeftMenuElement.appendChild(menuChoices[i][1]);
}
  }
  if (menu == 0) {
    menuChoices = [
      [shopOpen ? "Start next wave" : "Resume"],
      ["Inventory"],
      ["Shop"],
      ["colors"],
      ["Quota"],
    ];
    let rightMenus = [0, 1, 2, 3, 4];
    for (let i = 0; i < menuChoices.length; i++) {
      menuChoices[i].push(document.createElement("div"));
      menuChoices[i][1].className =
      i == 0 ?
        menuBlocked ?
        "menu-choice-inactive" :
        "menu-choice" :
        i == 2 ?
        shopOpen ?
        "menu-choice" :
        "menu-choice-inactive" :
        "menu-choice";
      menuChoices[i].push(() => {
        if (i == 0) {
          menuOpen = false;
          pause = false;
          switchMenu();
          if (shopOpen) {
            shopOpen = false;
            game.resetBoard();
            switchMenu();
          }
        }
        menu = i;
        switchMenu();
      });
      menuChoices[i].push(i==0 ? !menuBlocked : i == 2 ? shopOpen : true);
      menuChoices[i][1].innerHTML = menuChoices[i][0];
      menuChoices[i][4] = rightMenus[i];
      menuChoices[i][1].onclick = () => {
        if (mobile) {
          if (menuPointer != i) {
            menuPointer = i;
            BuildRightMenu(menuChoices[i][4]);
            navigateMenu("update");
          }
          else {
            if (menuChoices[i][3]) {
              menuChoices[i][2]();
            }
          }
        }
        else {
          if (menuChoices[i][3]) {
            menuChoices[i][2]();
          }
        }
      };
      menuChoices[i][1].onmousemove = () => {
        if (!mobile) {
          
          menuPointer = i;
          navigateMenu("update");
        }
      };
      LeftMenuElement.appendChild(menuChoices[i][1]);
    }
  } else if (menu == 1) {
    menuChoices = [
      [
        "Back",
        document.createElement("div"),
        () => {
          menu = 0;
          switchMenu();
        },
        true,
        5,
      ],
    ];
    menuChoices[0][1].onclick = () => {
      if (mobile) {
        if (menuPointer != 0) {
          menuPointer = 0;
          BuildRightMenu(menuChoices[0][4]);
          navigateMenu("update");
        }
        else {
          if (menuChoices[0][3]) {
            menuChoices[0][2]();
          }
        }
      }
      else {
        if (menuChoices[0][3]) {
          menuChoices[0][2]();
        }
      }
    };
    menuChoices[0][1].onmousemove = () => {
      if (!mobile) {
        
        menuPointer = 0;
        navigateMenu("update");
      }
    };
    menuChoices[0][1].innerHTML = menuChoices[0][0];
    menuChoices[0][1].className = "menu-choice";
    LeftMenuElement.appendChild(menuChoices[0][1]);
    for (let i = 0; i < inventoryIterable.length; i++) {
      menuChoices.push([inventoryIterable[i].name]);
      menuChoices[i + 1].push(document.createElement("div"));
      menuChoices[i + 1][1].className = shopOpen ?
        "menu-choice-inactive" :
        "menu-choice";
      menuChoices[i + 1].push(() => {
        if (!shopOpen) {
          if (
            inventoryIterable[i].lastUsed + inventoryIterable[i].cooldown <=
            timer && inventoryIterable[i] instanceof ItemCountable ?
            inventoryIterable[i].count > 0 :
            true
          ) {
            inventoryIterable[i].onActivate();
            inventoryIterable[i].lastUsed = timer;
            if (inventoryIterable[i] instanceof ItemCountable) {
              inventory[inventoryIterable[i].id].count -= 1;
            }
            pause = false;
            menuOpen = false;
            switchMenu();
          }
        }
      });
      menuChoices[i + 1].push(!shopOpen);
      menuChoices[i + 1][1].innerHTML = menuChoices[i + 1][0];
      menuChoices[i + 1][4] = 7;
      menuChoices[i + 1][1].onclick = () => {
        if (mobile) {
          if (menuPointer != i + 1) {
            menuPointer = i + 1;
            BuildRightMenu(menuChoices[i + 1][4]);
            navigateMenu("update");
          }
          else {
            if (menuChoices[i + 1][3]) {
              menuChoices[i + 1][2]();
            }
          }
        }
        else {
          if (menuChoices[i + 1][3]) {
            menuChoices[i + 1][2]();
          }
        }
      };
      menuChoices[i + 1][1].onmousemove = () => {
        if (!mobile) {
          
          menuPointer = i + 1;
          navigateMenu("update");
        }
      };
      LeftMenuElement.appendChild(menuChoices[i + 1][1]);
    }
  } else if (menu == 2) {
    menuChoices = [
      [
        "Back",
        document.createElement("div"),
        () => {
          menu = 0;
          switchMenu();
        },
        true,
        5,
      ],
    ];
    menuChoices[0][1].onclick = () => {
      if (mobile) {
        if (menuPointer != 0) {
          menuPointer = 0;
          BuildRightMenu(menuChoices[0][4]);
          navigateMenu("update");
        }
        else {
          if (menuChoices[0][3]) {
            menuChoices[0][2]();
          }
        }
      }
      else {
        if (menuChoices[0][3]) {
          menuChoices[0][2]();
        }
      }
    };
    menuChoices[0][1].onmousemove = () => {
      if (!mobile) {
        
        menuPointer = 0;
        navigateMenu("update");
      }
    };
    menuChoices[0][1].innerHTML = menuChoices[0][0];
    menuChoices[0][1].className = "menu-choice";
    LeftMenuElement.appendChild(menuChoices[0][1]);
    for (let i = 0; i < Items.length; i++) {
      menuChoices.push([
        Items[i].name +
        (Items[i].owned && !(Items[i] instanceof ItemCountable) ?
          " (SOLD OUT)" :
          " (" + Items[i].price + "$)"),
      ]);
      menuChoices[i + 1].push(document.createElement("div"));
      menuChoices[i + 1][1].className = "menu-choice";
      menuChoices[i + 1].push(() => {
        Items[i].buy();
        BuildRightMenu(8);
      });
      menuChoices[i + 1].push(
        Items[i] instanceof ItemCountable ? true : !Items[i].owned
      );
      menuChoices[i + 1][1].innerHTML = menuChoices[i + 1][0];
      menuChoices[i + 1][4] = 8;
      menuChoices[i + 1][1].onclick = () => {
        if (mobile) {
          if (menuPointer != i + 1) {
            menuPointer = i + 1;
            BuildRightMenu(menuChoices[i + 1][4]);
            navigateMenu("update");
          }
          else {
            if (menuChoices[i + 1][3]) {
              menuChoices[i + 1][2]();
            }
          }
        }
        else {
          if (menuChoices[i + 1][3]) {
            menuChoices[i + 1][2]();
          }
        }
      };
      menuChoices[i + 1][1].onmousemove = () => {
        if (!mobile) {
          
          menuPointer = i + 1;
          navigateMenu("update");
        }
      };
      LeftMenuElement.appendChild(menuChoices[i + 1][1]);
    }
  } else if (menu == 3) {
    menuChoices = [
      [
        "Back",
        document.createElement("div"),
        () => {
          menu = 0;
          switchMenu();
        },
        true,
        5,
      ],
    ];
    menuChoices[0][1].onclick = () => {
      if (mobile) {
        if (menuPointer != 0) {
          menuPointer = 0;
          BuildRightMenu(menuChoices[0][4]);
          navigateMenu("update");
        }
        else {
          if (menuChoices[0][3]) {
            menuChoices[0][2]();
          }
        }
      }
      else {
        if (menuChoices[0][3]) {
          menuChoices[0][2]();
        }
      }
    };
    menuChoices[0][1].onmousemove = () => {
      if (!mobile) {
        
        menuPointer = 0;
        navigateMenu("update");
      }
    };
    menuChoices[0][1].innerHTML = menuChoices[0][0];
    menuChoices[0][1].className = "menu-choice";
    LeftMenuElement.appendChild(menuChoices[0][1]);
    for (let i = 0; i < paletes.length; i++) {
      menuChoices.push([paletes[i].name]);
      menuChoices[i + 1].push(document.createElement("div"));
      menuChoices[i + 1][1].className = "menu-choice";
      menuChoices[i + 1].push(() => {
        if (!shopOpen) {
          currentPalete = i;
          pause = false;
          menuOpen = false;
          switchMenu();
        }
      });
      menuChoices[i + 1].push(!shopOpen);
      menuChoices[i + 1][1].innerHTML = menuChoices[i + 1][0];
      menuChoices[i + 1][4] = 6;
      menuChoices[i + 1][1].onclick = () => {
        if (mobile) {
          if (menuPointer != i + 1) {
            menuPointer = i + 1;
            BuildRightMenu(menuChoices[i + 1][4]);
            navigateMenu("update");
          }
          else {
            if (menuChoices[i + 1][3]) {
              menuChoices[i + 1][2]();
            }
          }
        }
        else {
          if (menuChoices[i + 1][3]) {
            menuChoices[i + 1][2]();
          }
        }
      };
      menuChoices[i + 1][1].onmousemove = () => {
        if (!mobile) {
          
          menuPointer = i + 1;
          navigateMenu("update");
        }
      };
      LeftMenuElement.appendChild(menuChoices[i + 1][1]);
    }
  } else if (menu == 4) {
    menuChoices = [
      [
        "Back",
        document.createElement("div"),
        () => {
          menu = 0;
          switchMenu();
        },
        true,
        5,
      ],
      [
        "Info",
        document.createElement("div"),
        () => {
          menu = 0;
          switchMenu();
        },
        false,
        9,
      ]
    ];
    for (let i = 0; i < menuChoices.length; i++) {
      menuChoices[i][1].innerHTML = menuChoices[i][0];
      menuChoices[i][1].className =
        i == 1 ?
        shopOpen ?
        "menu-choice" :
        "menu-choice-inactive" :
        "menu-choice";
      menuChoices[i][1].onclick = () => {
        if (mobile) {
          if (menuPointer != i) {
            menuPointer = i;
            BuildRightMenu(menuChoices[i][4]);
            navigateMenu("update");
          }
          else {
            if (menuChoices[i][3]) {
              menuChoices[i][2]();
            }
          }
        }
        else {
          if (menuChoices[i][3]) {
            menuChoices[i][2]();
          }
        }
      };
      menuChoices[i][1].onmousemove = () => {
        if (!mobile) {
          
          menuPointer = i;
          navigateMenu("update");
        }
      };
      LeftMenuElement.appendChild(menuChoices[i][1]);
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
    if (menuPointer < menuChoices.length - 1) {
      menuChoices[menuPointer][1].id = "";
      menuPointer++;
      menuChoices[menuPointer][1].id = "menu-selected";
    }
  }
  if (action == "update") {
    for (let i = 0; i < menuChoices.length; i++) {
      menuChoices[i][1].id = "";
    }
    
    menuChoices[menuPointer][1].id = "menu-selected";
  }
  if (action == "select") {
    if (menuChoices[menuPointer][3]) {
      menuChoices[menuPointer][2]();
    }
  }
  BuildRightMenu(menuChoices[menuPointer][4]);
}