
const animationUpdate = 10;
const RenderingLayers = [];
class RenderingLayer{
  constructor(){
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    RenderingLayers.push(this);
  }
  draw(x = 0, y = 0){
    ctx.drawImage(this.canvas,x,y);
  }
}
class textParticle{
  constructor(startColor,endColor,startOpacity,endOpacity,distancex,distancey,duration){
    this.startColor = startColor;
    this.endColor = endColor;
    this.startOpacity = startOpacity;
    this.endOpacity = endOpacity;
    this.duration = duration;
    this.movex = distancex / (duration * animationUpdate);
    this.movey = distancey / (duration * animationUpdate);
    this.frames = duration * animationUpdate;
  }
  play(x,y,text,step = 0){
    AnimationLayer.ctx.clearRect(0,0,game.cellWidth * game.boardWidth,game.cellHeight * game.boardHeight);
    AnimationLayer.ctx.fillStyle = this.startColor;
    AnimationLayer.ctx.textAlign = "center";
    AnimationLayer.ctx.font = "30px sans-serif";
    console.log(step,this.frames);
    AnimationLayer.ctx.fillText(text,x,y);
    
    if (step < this.frames){
    setTimeout(this.play.bind(this),animationUpdate,x+this.movex,y+this.movey,text,step+1);
    }
  }
}

const BoardLayer = new RenderingLayer();
const ShapeLayer = new RenderingLayer();
const AnimationLayer = new RenderingLayer();
var fps;
var lastCalledTime;
function render(){
  BoardLayer.draw();
  ShapeLayer.draw();
  AnimationLayer.draw();
  if(!lastCalledTime) {
     lastCalledTime = performance.now();
     fps = 0;
     return;
  }
  delta = (performance.now() - lastCalledTime)/1000;
  lastCalledTime = performance.now();
  fps = 1/delta;
  ctx.fillText(Math.floor(fps),50,50)
}