var url = new URLSearchParams(window.location.search);
    if (url.has("t")){
      sessionStorage.setItem("testerMode",true);
      alert("Thank you for testing my game!\nIf you find any bugs, press the b button to send a report\nIf you want to share an opinion, press the n button to send feedback\nBE AS CRITICAL AS POSSIBLE if you don't like something, tell me");
    }
    if (url.has("d")){
      sessionStorage.setItem("tetis2Debug",true);
      alert("debug mode enabled")
    }
    if (localStorage.getItem("Tetis2Save") == undefined){
      console.log("creating save data");
      var save = {
        money: 0,
        wave: 0,
        items:[],
        medalions:[]
      }
      localStorage.setItem("Tetis2Save",JSON.stringify(save));
    }
    
    function startcustommode(
      time,
      speed,
      name,
      boardHeight,
      boardWidth,
      tutorial,
      legacy,
      allowSaving
    ) {
      sessionStorage.setItem(
        "gdata",
        JSON.stringify({
          name: name,
          timeLimit: time,
          speed: speed,
          boardWidth: boardWidth,
          boardHeight: boardHeight,
          legacy:legacy,
          allowSaving: allowSaving,
          colors: [
          {
            name: "Tetis 2",
            active: "#0D6D6A",
            background: "#BCABAE",
            trail: "#0A4C49",
            fallen: "#0F0F0F",
            text: "white",
          },
          {
            name: "tetis 2 pink",
            active: "#C492B1",
            background: "#88D5FB",
            trail: "#0877ff",
            fallen: "#AF3B6E",
            text: "white",
          },
          {
            name: "tetis 2 blue",
            active: "#3D52D5",
            background: "#3C3744",
            trail: "#0877ff",
            fallen: "#090C9B",
            text: "white",
          },
          {
            name: "tetis 1 v2.0",
            active: "#fc0303",
            background: "#039dfc",
            trail: "#0877ff",
            fallen: "#ababab",
            text: "white",
          },
          {
            name: "ocean",
            active: "cyan",
            background: "darkblue",
            trail: "lightblue",
            fallen: "grey",
            textcolor: "white",
          },
          {
            name: "blue light mode",
            active: "cyan",
            background: "white",
            trail: "lightblue",
            fallen: "grey",
            text: "blue",
          },
          {
            name: "ultra dark mode",
            active: "darkgrey",
            background: "black",
            trail: "grey",
            fallen: "lightgrey",
            text: "white",
          },
          {
            name: "matrix",
            active: "green",
            background: "black",
            trail: "lime",
            fallen: "darkgreen",
            text: "white",
          },
          {
            name: "blue dark mode",
            active: "darkblue",
            background: "black",
            trail: "blue",
            fallen: "grey",
            text: "white",
          },
          {
            name: "amogus",
            active: "red",
            background: "grey",
            trail: "grey",
            fallen: "white",
            text: "white",
          },
          {
            name: "tetis 1 v1.5",
            active: "#105b66",
            background: "#292929",
            trail: "#283d40",
            fallen: "#092529",
            text: "white",
          }, ],
          blocks: [
            { pattern: [true, false, true, true, true, false], width: 2, name: "T" },
            { pattern: [false, true, true, true, true, false], width: 3, name: "Z-right" },
            { pattern: [true, true, true, true], width: 2, name: "Square" },
            { pattern: [true, true, true, true], width: 1, name: "I" },
            { pattern: [true, false, false, true, true, true], width: 3, name: "L-left" },
            { pattern: [true, true, false, false, true, true], width: 3, name: "Z-left" },
            { pattern: [false, false, true, true, true, true], width: 3, name: "L-right" },
          ],
          tutorialEnabled: tutorial,
          tutorial: [
          {
            appear: "auto",
            text: "welcome to Tetis 2!<br>(press e or click anywhere to continue)",
            action: "pause = true;timeLimit = -1",
            afterAction: "",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "auto",
            text: "you make money by clearing lines",
            action: "",
            afterAction: "",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "auto",
            text: "try it yourself!",
            action: "",
            afterAction: "pause = false",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "clearLine",
            text: "great job!",
            action: "pause = true",
            afterAction: "",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "auto",
            text: "if placed blocks reach the top you loose all of your money",
            action: "",
            afterAction: "",
            condition: "true",
            position: "bottom",
            close: ""
          },
          {
            appear: "auto",
            text: "this game is split into waves",
            action: "",
            afterAction: "",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "auto",
            text: "you can see how much time is left in the top left corner",
            action: "",
            afterAction: "timeLimit = gameData.timeLimit;",
            condition: "true",
            position: "top",
            close: ""
          }, 
          {
            appear: "auto",
            text: "after that time is up, the board gets cleared, and the menu gets opened",
            action: "",
            afterAction: "",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "auto",
            text: "try clearing the first wave",
            action: "",
            afterAction: "pause = false;timeLimit = gameData.timeLimit;time=0;game.resetBoard();",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "clearWave",
            text: "great job!",
            action: "menuBlocked = true;",
            afterAction: "",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "auto",
            text: "your main goal is to make enough money to meet the quota",
            action: "",
            afterAction: "",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "auto",
            text: "you can always see information about the current quota in this menu",
            action: "",
            afterAction: "",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "auto",
            text: "between waves you can access the shop",
            action: "",
            afterAction: "",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "auto",
            text: "the shop has a rotation of 4 random items you can buy",
            action: "menu = 1;BuildMenu()",
            afterAction: "",
            condition: "true",
            position: "bottom",
            close: ""
          },
          {
            appear: "auto",
            text: "more items will be avaliable in the shop as you progress, so make sure to check it often",
            action: "",
            afterAction: "",
            condition: "true",
            position: "bottom",
            close: ""
          },
          {
            appear: "auto",
            text: "I'll give you 10$ to buy something",
            action: "money+=10;",
            afterAction: "",
            condition: "true",
            position: "top",
            close: ""
          },
          {
            appear: "auto",
            text: "that's it for now, enjoy Tetis 2!",
            action: "menuBlocked = false;BuildMenu();",
            afterAction: "",
            condition: "true",
            position: "top",
            close: ""
          }
          ]
        })
      );
      window.location.href = "game.html";
    }
    function resetData() {
      var reset = prompt("type 'reset' to reset saved data");
      if (reset == "reset"){
        var save = {
        money: 0,
        wave: 0,
        items:[],
        medalions:[]
      }
        localStorage.setItem("Tetis2Save",JSON.stringify(save));
      }
    }