import Matter from 'matter-js'
const Bodies = Matter.Bodies
const World = Matter.World
import "p5";

class Boundary {
  constructor(world, params={}) {
    const {x,y,w,h, options={}} = params
    const combinedOptions = Object.assign({}, {
      isStatic: true,
    }, options)
    console.log(combinedOptions)
    this.body = Bodies.rectangle(x,y,w,h,combinedOptions);
    this.x = x
    this.y = y
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
    rect(0, 0, this.w, this.h)
    fill(0)
    noStroke()
    pop();
  }
}

export default Boundary
