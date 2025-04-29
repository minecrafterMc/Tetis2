if (sessionStorage.getItem("gdata")) {
  var gameData = JSON.parse(sessionStorage.getItem("gdata"));
} else {
  location.href = "index.html";
}
if (sessionStorage.getItem("testerMode")){
  gameData.testerMode = sessionStorage.getItem("testerMode");
}
const paletes = gameData.colors;
var currentPalete = 0;
const blocks = gameData.blocks;
const game = new gameManager(30, 30, gameData.boardWidth, gameData.boardHeight, paletes);
game.quotaEnabled = true;
const AbilityRegistries = {
  onLineClear: [],
  onBlockFall: [],
  onitemUse: [],
  onWaveEnd: [],
  onWaveDeath: [],
  passive: [],
  run: function(cat){
    let iterable = [];
    let keys = Object.keys(AbilityRegistries[cat]);
    for (let i = 0; i < keys.length; i++) {
      iterable[i] = AbilityRegistries[cat][keys[i]];
    }
    for (let i = 0; i < iterable.length; i++) {
      if (iterable[i] != undefined){
        if (typeof iterable[i] == "function")
        iterable[i]();
        else
      iterable[i].onActivate();
      }
    }
  }
};

const RegisteredItems = [
 
  new AbilityCountable(
    0,
    "Increase board width",
    "adds a new column to the board and adds 1 to your income",
    10,
    10,
    function(){
      game.boardWidth += 1;
      income += 1;
    },
    function(){},
    AbilityRegistries.passive,
    0
  ),
  new AbilityCountable(
    1,
    "Expand Timer",
    "makes the time limit longer by 10 seconds",
    5,
    10,
    function(){
      timeLimit += 10;
    },
    function(){},
    AbilityRegistries.passive,
    0
  ),
  new AbilityCountable(
    2,
    "Increase board height",
    "Makes the board higher",
    20,
    10,
    function(){
      game.boardHeight = game.BoardHeight + 1;
    },
    function(){},
    AbilityRegistries.passive,
    5
  ),
  new ItemCountable(
    3,
    "Gold",
    "Gold doesen't disapear after death, and can be sold for half of its price",
    2,
    0,
    function(){
      money += 1;
      itemAmount--;
    },
    function(){},
    function(){
      return "";
    },
    0
  ),
    new Ability(4,"Double Income","Speeds up the game and doubles collected money for the next wave",30,0,
    function(){
      speedDiv += 2;
    },
    function(){
      collectedMoney *= 2;
      this.owned = false;
      itemAmount--;
      AbilityRegistries.onWaveEnd[this.id] = undefined;
    },AbilityRegistries.onWaveEnd,
      5
    ),
    new Ability(5,"Slow motion","Slows down the game for the next wave",20,0,
      function(){
        speedMod += 2;
      },
      function(){
        this.owned = false;
        itemAmount--;
      },AbilityRegistries.onWaveEnd,
      5
    ),
      new AbilityCountable(6,"Increase Speed","increases game speed and income",10,0,function(){
        if (realSpeed > 1){
          realSpeed -= 1;
          income++;
        }
        else {
          money += this.price;
        }
        AbilityRegistries.onWaveEnd[this.id] = undefined;
    },function(){},
    AbilityRegistries.passive,
        5
      ),
    new AbilityCountable(7,"Decrese Speed","decreases game speed",50,0,function(){
      realSpeed++;
    },function(){},
    AbilityRegistries.passive,
      5
    ),
    new AbilityLimited(8,"Upgrade Shop","adds an additional slot to the shop",50,4,0,function(){
      shopOptions++;
      this.price = Math.floor(this.price * 1.5);
      generateShop();
      BuildMenu();

    },function(){},
    AbilityRegistries.passive,
      5
    ),
    new Ability(9,"Death Save","Saves you from loosing all of your money after loosing a wave",10,0,
    function(){
      this.data.amountBought++;
      this.price = 10 + this.data.amountBought * 30;
    },
    function(){
      defyDeath = true;
      this.owned = false;
    },
    AbilityRegistries.onWaveDeath,0,{amountBought:0}),
    new Ability(10,"Small block","unlocks a 1x1 block as a shape",100,0,function(){
      blocks.push({ pattern: [true], width: 1, name: "1x1" });
    },function(){},AbilityRegistries.passive,10),
    new ItemCountable(11,"Strengthen Gravity","Makes all floating blocks fall",75,0,function(){
      game.dropFloatingBlocks();
    },
    function(){},
    function(){},
    10
    ),
    new Medalion(12,"remember to name this","multiplies your income by 2 - (amount of items you bought * 0.01)",10,5,[
      [AbilityRegistries.onWaveEnd,function(){
        collectedMoney *= 2 - (itemAmount * 0.01);
        collectedMoney = Math.floor(collectedMoney);
      }]
    ],0),
    new Ability(13,"reroll","rerolls the shop",10,0,function(){
  generateShop();
  BuildMenu()
  this.owned = false;
},function(){},AbilityRegistries.passive,0,{},false)
  
];
var Items = [
  
]
var quotas = [
  10,
  40,
  80,
  100,
  150,
  200,
  400,
  700,
  1000
]
var mobile = navigator.appVersion.indexOf("Android") != -1 || navigator.appVersion.indexOf("ios") != -1;
if (!mobile){
  let elements = document.getElementsByClassName("controlls");
  elements[0].style.display = "none";
  elements[1].style.display = "none";
}
var frame = 0;
var inputFrame = 0;
var fastFrame = 0;
var timer = 0;
var speed = gameData.speed;
var realSpeed = gameData.speed;
var speedMod = 1;
var speedDiv = 1;
var fastUpdateId;
var money = 0;
var itemAmount = 0;
var wave = 0;
var timeLimit = gameData.timeLimit;
var income = 1;
var collectedMoney = 0;
var shopOptions = 4;
var defyDeath = false;
var legacyMode = gameData.legacy;
var menuBlocked = false;
var menuOpen = false;
var pause = false;
var menuPointer = 0;
var menu = 0;
var tutorialStep = 0;
var shopOpen = false;
var menuChoices = [];
var inventory = {};
var inventoryIterable = [];
var medalionSlots = 3;
var medalionCount = 0;
var medalions = [];
var medalionsIterable = [];
const pressedKeys = {
  "a": false,
  "d": false,
  "arrowLeft": false,
  "arrowRight": false
  
}
var settings = {
  "sound": true,
  "music": true,
}
if(localStorage.getItem("tetis2settings")){
  settings = JSON.parse(localStorage.getItem("tetis2settings"));
}
if (settings.music){
  sounds.music[RandomInt(0,sounds.music.length-1)].play();
}
if (localStorage.getItem("playedTetis2Tutorial") == null && !gameData.tutorialEnabled){
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
  keys = Object.keys(AbilityRegistries);
  for (let i = 0; i < keys.length - 1; i++) {
    for (let j =0;j<AbilityRegistries[keys[i]].length;j++){
      if (AbilityRegistries[keys[i]][j] != undefined){
      if (AbilityRegistries[keys[i]][j].owned){
        inventoryIterable.push(AbilityRegistries[keys[i]][j]);
      }
    }
  }
}
updateMedalionsIterable();
}
function updateMedalionsIterable() {
  medalionsIterable = [];
  let keys = Object.keys(medalions);
  for (let i = 0; i < keys.length; i++) {
    if (medalions[keys[i]] != undefined)
    medalionsIterable.push(medalions[keys[i]]);
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
    if (frame % Math.ceil(speed) == 0) {
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
      if (timer >= timeLimit && timeLimit > 0 && !legacyMode) {
        AbilityRegistries.run("onWaveEnd");
        money += collectedMoney;
        speedMod = 1;
        speedDiv = 1;
        collectedMoney = 0;
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
        menu = 0;
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
    moneyElement.innerHTML = collectedMoney + "$<br>";
      
    }
    if (frame % 1 == 0) {
      game.detectFullRow();
      game.detectFullBoard();
    }
    
    //frame += RandomInt(-1,1); // this is for april fools, its really funny
    frame++;
    inputFrame++;
  }
}


setInterval(update, 50);

leftMoveButton.addEventListener("touchstart", (event) => {
  console.log("detected");
    pressedKeys.a = true;
      cell1.move(-1, 0);
      inputFrame = -2;
});
leftMoveButton.addEventListener("touchend", (event) => {
    pressedKeys.a = false;
  
});
rightMoveButton.addEventListener("touchstart", (event) => {
    pressedKeys.d = true;
      cell1.move(1, 0);
      inputFrame = -2;
});
rightMoveButton.addEventListener("touchend", (event) => {
    pressedKeys.d = false;
});
leftRotButton.addEventListener("touchstart", (event) => {
    pressedKeys.arrowLeft = true;
      cell1.rotate("left");
      inputFrame = -2;
});
leftRotButton.addEventListener("touchend", (event) => {
    pressedKeys.arrowLeft = false;
});
rightRotButton.addEventListener("touchstart", (event) => {
    pressedKeys.arrowRight = true;
      cell1.rotate("right");
      inputFrame = -2;
});
rightRotButton.addEventListener("touchend", (event) => {
    pressedKeys.arrowRight = false;
});
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
    if (TutorialElement.style.display == "none" || !gameData.tutorialEnabled) {
    if (!menuOpen) {
      pause = !pause;
      menuOpen = !menuOpen;
      menu = 0;
      switchMenu();
    } else {
      navigateMenu("select");
    }
  }
  else{
    if (gameData.tutorialEnabled){
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
        localStorage.setItem("playedTetis2Tutorial",true);
        sessionStorage.setItem("gdata",JSON.stringify(gameData));
        BuildMenu();
      }
      }
    }
  }
}
});
if (gameData.testerMode){
window.addEventListener("keydown", (event) => {
  if (event.key == "b") {
    sendFeedback("bug");
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key == "n") {
    sendFeedback("feedback");
  }
});
}
function sendFeedback(type){
  let feedback;
  if (type == "bug"){
  feedback = prompt("(you can submit feednack in english and polish)\nDescribe what's wrong:");
  }
  else{
  feedback = prompt("(you can submit feednack in english and polish)\nDescribe your feedback:");
  }
  if (feedback != null) {
    fetch(atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTMyOTczMDUzMzA5NzM0MDk2OC9YR29TQjBzSUM2S0tjMWZNVmdzV1VyUGdINnJlSUFmcTRlWlpFN0V6eHhONzVRTVNSYWlXQUc5WU1HOHYzZXEtTVFqMQ=="), {
      method: "POST",
      body: JSON.stringify({
        "content": `\n\n\n\n\n\n\n--------------------------------\n${type}\n${feedback}\n--\n${JSON.stringify(game)}`,
        "embeds": null,
        "username": "Tetis2 tester feedback",
        "attachments": []
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    fetch(atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTMyOTczMDUzMzA5NzM0MDk2OC9YR29TQjBzSUM2S0tjMWZNVmdzV1VyUGdINnJlSUFmcTRlWlpFN0V6eHhONzVRTVNSYWlXQUc5WU1HOHYzZXEtTVFqMQ=="), {
      method: "POST",
      body: JSON.stringify({
        "content": `\n--\n${JSON.stringify(board)}\n--\n${JSON.stringify({originX:cell1.originX,originY:cell1.originY,shape:cell1.shape})}\n--\n${JSON.stringify({"frame":frame,"speed":speed,"tutorialStep":tutorialStep,'timer':timer,'money':money,"income":income,"mobile":mobile,"wave":wave,"timeLimit":timeLimit,"collectedMoney":collectedMoney,"legacyMode":legacyMode,"menuOpen":menuOpen,"menuPointer":menuPointer,"menuBlocked":menuBlocked,"pause":pause,"shopOpen":shopOpen})}`,
        "embeds": null,
        "username": "Tetis2 tester feedback",
        "attachments": []
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    alert("Feedback sent!\nThank you for your help!\nIf you have questions, suggestions or you wanna explain your feedback, please contact me on discord: @minecraftermc");
  }
}
function generateShop() {
  Items = [RegisteredItems[13]];
  for (let i = 0; i < shopOptions; i++) {
    let item;
    do{ 
    item = RegisteredItems[RandomInt(0, RegisteredItems.length - 1)];
    } while(Items.includes(item) || !item.canBeRolled || item.unlockAt > wave);
    Items.push(item);
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
    window.onclick = () => {
      if (eval(gameData.tutorial[tutorialStep].condition) && !(TutorialElement.style.display == "none")) {
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
        localStorage.setItem("playedTetis2Tutorial",true);
        sessionStorage.setItem("gdata",JSON.stringify(gameData));
        BuildMenu();
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
    let unlockedItems = 0;
    for (let i = 0;i<RegisteredItems.length ;i++){
      if (RegisteredItems[i].unlockAt <= wave && RegisteredItems[i].canBeRolled){
        unlockedItems++;
      }
    }
    RightMenuElement.innerHTML+="<br><h1>Amount of unlocked items: "+unlockedItems+"</h1>";
  }
  if (menuId == 3) {
    RightMenuElement.innerHTML =
      "<h1>Change your color palete</h1>";
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
   /* if (inventoryIterable[menuPointer - 1].cooldown > 0) {
      RightMenuElement.innerHTML +=
        "<h1 class='itemDisplay'>Cooldown: " +
        (timer - inventoryIterable[menuPointer - 1].lastUsed <
          inventoryIterable[menuPointer - 1].cooldown ?
          inventoryIterable[menuPointer - 1].cooldown -
          (timer - inventoryIterable[menuPointer - 1].lastUsed) :
          "0") +
        "</h1><br>";
    }*/
    if (inventoryIterable[menuPointer - 1] instanceof ItemCountable || inventoryIterable[menuPointer - 1] instanceof AbilityCountable) {
      RightMenuElement.innerHTML +=
        "<h1 class='itemDisplay'>Owned: " +
        inventoryIterable[menuPointer - 1].count +
        "</h1><br>";
    }
    if (inventoryIterable[menuPointer - 1].customInventoryText != undefined) {
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
    /*RightMenuElement.innerHTML +=
      "<h1 class='itemDisplay'>Cooldown: " +
      Items[menuPointer - 1].cooldown +
      "</h1><br>";*/
    RightMenuElement.innerHTML +=
      "<h1 class='itemDisplay'>Price: " +
      Items[menuPointer - 1].price +
      "$</h1><br>";
    if (inventoryIterable[menuPointer - 1] instanceof ItemCountable || inventoryIterable[menuPointer - 1] instanceof AbilityCountable) {
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
  if (menuId == 10) {
    RightMenuElement.innerHTML = "<h1>"+(["Sound: ","Music: "][menuPointer-1])+([settings.sound,settings.music][menuPointer-1] ? "on" : "off")+"</h1><br>";
  }
  if (menuId == 11){
    RightMenuElement.innerHTML = "<h1>Change your settings</h1>"
  }
  if(menuId == 12){
    RightMenuElement.innerHTML = "<h1>View and manage your medalions</h1>"
  }
  if (menuId == 13) {
  RightMenuElement.innerHTML =
    "<h1 class='itemDisplay'>" +
    medalionsIterable[menuPointer - 1].name +
    "</h1><br>";
  RightMenuElement.innerHTML +=
    "<h1 class='itemDisplay'>" +
    medalionsIterable[menuPointer - 1].description +
    "</h1><br>";
    RightMenuElement.innerHTML += "<h1>Sell value: "+medalionsIterable[menuPointer-1].sellValue+"</h1><br>";
    RightMenuElement.innerHTML += "<h1>Taken medalion slots: " + medalionsIterable[menuPointer-1].takenSlots+"/"+medalionSlots+"<br>(total: " + medalionCount +"/"+medalionSlots+")</h1>";
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
      ["Medalions"],
      ["Shop"],
      ["Colors"],
      ["Quota"],
      ["Settings"],
    ];
    let rightMenus = [0, 1, 12, 2, 3, 9, 11];
    for (let i = 0; i < menuChoices.length; i++) {
      menuChoices[i].push(document.createElement("div"));
      menuChoices[i][1].className =
      i == 0 ?
        menuBlocked ?
        "menu-choice-inactive" :
        "menu-choice" :
        i == 3 ?
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
            speed = Math.ceil(realSpeed * speedMod / speedDiv);
            switchMenu();
          }
        }
        menu = i;
        switchMenu();
      });
      menuChoices[i].push(i==0 ? !menuBlocked : i == 3 ? shopOpen : true);
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
      menuChoices[i + 1][1].className = shopOpen || inventoryIterable[i] instanceof Ability ?
        "menu-choice-inactive" :
        "menu-choice";
      menuChoices[i + 1].push(() => {
        if (!shopOpen) {
          if (
            inventoryIterable[i].lastUsed + inventoryIterable[i].cooldown <=
            timer && inventoryIterable[i] instanceof ItemCountable ?
            inventoryIterable[i].count > 0 :
            inventoryIterable[i] instanceof Item
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
  } 
  else if (menu == 2) {
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
  for (let i = 0; i < medalionsIterable.length; i++) {
    menuChoices.push([medalionsIterable[i].name]);
    menuChoices[i + 1].push(document.createElement("div"));
    menuChoices[i + 1][1].className = 
      "menu-choice";
    menuChoices[i + 1].push(() => {
      medalionsIterable[i].sell();
      menuPointer = 0;
      BuildMenu();
    });
    menuChoices[i + 1].push(true);
    menuChoices[i + 1][1].innerHTML = menuChoices[i + 1][0];
    menuChoices[i + 1][4] = 13;
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
}else if (menu == 3) {
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
        (Items[i].owned && !(Items[i] instanceof ItemCountable || Items[i] instanceof AbilityCountable) ?
          " (SOLD OUT)" :
          !(Items[i] instanceof AbilityLimited) ? " (" + Items[i].price + "$)" : (Items[i].count < Items[i].maxAmount) ? " (" + Items[i].price + "$)" : " (SOLD OUT)"),
      ]);
      menuChoices[i + 1].push(document.createElement("div"));
      menuChoices[i + 1][1].className = "menu-choice";
      menuChoices[i + 1].push(() => {
        RegisteredItems[Items[i].id].buy();
        if (settings.sound) {
          sounds.buy[RandomInt(0,sounds.buy.length -1)].play();
        }
        BuildRightMenu(8);
        BuildMenu();
      });
      menuChoices[i + 1].push(
        Items[i] instanceof ItemCountable || Items[i] instanceof AbilityCountable ? true : !Items[i].owned
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
  } else if (menu == 5) {
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
  else if (menu == 6) {
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
        "Sound",
        document.createElement("div"),
        () => {
          settings.sound = !settings.sound;
          BuildMenu();
          localStorage.setItem("tetis2settings",JSON.stringify(settings))
        },
        true,
        10,
      ],
      [
        "Music",
        document.createElement("div"),
        () => {
          settings.music = !settings.music;
          if (settings.music) {
            sounds.music[RandomInt(0,1)].play();
          }
          else{
            sounds.music[0].stop();
            sounds.music[1].stop();
          }
          localStorage.setItem("tetis2settings",JSON.stringify(settings))
          BuildMenu();
        },
        true,
        10,
      ]
    ];
    for (let i = 0; i < menuChoices.length; i++) {
      menuChoices[i][1].innerHTML = menuChoices[i][0];
      menuChoices[i][1].className =
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