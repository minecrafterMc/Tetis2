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
    ],2),
    new Ability(13,"reroll","rerolls the shop",10,0,function(){
  generateShop();
  BuildMenu()
  this.owned = false;
},function(){},AbilityRegistries.passive,0,{},false),
new Medalion(14,"panic slowdown","slows down the game more the higher you build",30,10,[[AbilityRegistries.onBlockFall,function(){
  let percent = Math.floor(((game.boardHeight - game.getHighestPoint()) / game.boardHeight) * 100);
  speed = Math.floor(Math.floor(realSpeed * speedMod / speedDiv) + percent * 0.3)
}]],2),
new Medalion(15,"Piggy Bank","gives you 4$ every wave",15,10,[[AbilityRegistries.onWaveEnd,function(){money += 4}]],0),
new Medalion(16,"name this later 2","multiplies your income by half of the level of your current quota",80,50,[[AbilityRegistries.onWaveEnd,function(){collectedMoney *= Math.floor(wave / 5) / 2; collectedMoney = Math.floor(collectedMoney)}]],15)
  
];
