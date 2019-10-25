import Matter from 'matter-js'
const Bodies = Matter.Bodies
const World = Matter.World
import "p5";

class Box {
  constructor(world, params={}) {
    const {x,y,w,h, options} = params
    this.body = Bodies.rectangle(x,y,w,h, options);
    this.w = w
    this.h = h
    World.add(world, this.body)
  }

  show () {
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle)
    rectMode(CENTER)
    strokeWeight(1)
    stroke(255)
    fill(155)
    rect(0,0,this.w,this.h);
    pop();
  }
}


export default Box
