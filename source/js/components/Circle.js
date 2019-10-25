import Matter from 'matter-js';
const Bodies = Matter.Bodies;
const Events = Matter.Events;
const World = Matter.World;
import 'p5';

import {getDistanceY, getDistanceX} from '../utils';

class Circle {
  constructor(x, y, r, options) {
    this.body = Bodies.circle(x, y, r, options);
    this.r = r;
    this.body.label = options.label || 'ball';
  }

  show() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    stroke(255);
    fill(155);
    ellipse(0, 0, this.r * 2);
    pop();
  }
}


export default Circle;
