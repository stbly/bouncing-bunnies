import Matter from 'matter-js';
const Engine = Matter.Engine;
const Body = Matter.Body;
const Events = Matter.Events;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;
import 'p5';

import Circle from './Circle';
import Trampoline from './Trampoline';

import {getDistanceY, getBodyCoordinate, bodyPositions} from '../utils';

const postHeight = 50;
const trampolineX = 0;
const trampolineHeight = 20;
const trampolineY = window.innerHeight - postHeight;
const marginH = 20;

class Level {
  constructor(width, height, options) {
    this.world = options.world;
    this.engine = options.engine;
    this.width = width;
    this.height = height;

    this.allowJumpCharge = false;
    this.consecutiveJumps = 0;
    this.consecutiveJumpBonus = 0;
    this.consecutiveJumpBonusMax = 1.25;
    this.highestVelocityY = 0;
    this.jumpChargeMin = 0;
    this.jumpChargeMax = 1;
    this.jumpCharge = this.jumpChargeMin;
    this.jumpChargeIncrease = 0.0005;
    this.jumpForce = 2;
    this.shouldChargeJump = false;

    this.loop = this.loop.bind(this);
    this.start = this.start.bind(this);
    this.render = this.render.bind(this);

    createCanvas(this.width, this.height);
    this.createElements();
  }

  createElements() {
    const trampolineWidth = this.width - marginH * 2;
    const trampolineSmoothness = Math.floor(trampolineWidth / 25);

    this.trampoline = new Trampoline(
      marginH,
      trampolineY,
      trampolineSmoothness,
      trampolineWidth,
      trampolineHeight
    );

    const post1 = Bodies.rectangle(
      -marginH / 2,
      this.height - postHeight / 2,
      marginH,
      postHeight,
      {
        isStatic: true,
      }
    );

    const post2 = Bodies.rectangle(
      this.width + marginH / 2,
      this.height - postHeight / 2,
      marginH,
      postHeight,
      {
        isStatic: true,
      }
    );

    const link1 = this.trampoline.body.bodies[0];
    const link2 = this.trampoline.body.bodies[this.trampoline.body.bodies.length - 1];
    World.add(this.world, this.trampoline.body);

    World.add(this.world, [
      post1,
      post2,
      Bodies.rectangle(
        -marginH / 2,
        window.innerHeight / 2,
        marginH,
        window.innerHeight,
        {isStatic: true}
      ),
      Bodies.rectangle(
        this.width + marginH / 2,
        window.innerHeight / 2,
        marginH,
        window.innerHeight,
        {isStatic: true}
      ),
      Constraint.create({
        bodyA: post1.body,
        pointA: getBodyCoordinate(post1, bodyPositions.TOP_RIGHT),
        bodyB: link1,
        pointB: {x: 0, y: 0},
        length: 0,
        stiffness: 1,
      }),
      Constraint.create({
        bodyA: post2.body,
        pointA: getBodyCoordinate(post2, bodyPositions.TOP_LEFT),
        bodyB: link2,
        pointB: {x: 0, y: 0},
        length: 0,
        stiffness: 1,
      }),
    ]);
  }

  start() {
    this.ball = new Circle(this.width / 2, trampolineY - 50, 50, {
      // friction: 0,
      // frictionStatic: 0,
      frictionAir: 0.001,
      restitution: 0.9,
      mass: 30,
    });

    World.add(this.world, this.ball.body);
  }

  handleClick() {
    const jumpBuffer = 25 + (Math.sqrt(Math.abs(this.ball.body.velocity.y)) * 25);
    const canJump = this.distanceOfBallFromTrampoline() <= jumpBuffer;
    if (canJump) {
      this.bounceBall();
    } else {
      this.highestVelocityY = 0;
      this.consecutiveJumps = 0;
      this.consecutiveJumpBonus = 0;
    }
  }

  bounceBall() {
    const {body} = this.ball;
    const {mass, position, velocity, bounds} = body;

    if (velocity.y >= this.highestVelocityY) {
      this.highestVelocityY = velocity.y;
      this.consecutiveJumps++;
      this.consecutiveJumpBonus = (1 + (this.consecutiveJumps * 0.0125));
    }

    const baseIncrease = (velocity.y * 0.25);
    const bonusVelocity = Math.min(this.consecutiveJumpBonusMax, this.consecutiveJumpBonus);
    const jumpChargeBonus = Math.pow(1 + (this.jumpCharge), 2);

    const magnitute = (baseIncrease + this.jumpForce) * bonusVelocity * jumpChargeBonus;

    Body.applyForce(body, position, {
      x: 0,
      y: magnitute,
    });

    this.jumpCharge = this.jumpChargeMin;
  }

  startCharge() {
    if (this.allowJumpCharge) {
      this.allowJumpCharge = false;
      this.shouldChargeJump = true;
    }
  }

  distanceOfBallFromTrampoline() {
    const {body} = this.ball;
    const {position, bounds} = body;
    const bottomY = position.y + ((bounds.max.y - bounds.min.y) / 2) + (trampolineHeight / 2);

    return getDistanceY(bottomY, trampolineY);
  };

  loop() {
    if (this.ball) {
      this.ball.body.position = {x: this.width / 2, y: this.ball.body.position.y};
    }
  }

  render() {
    if (this.distanceOfBallFromTrampoline() >= 25) {
      this.allowJumpCharge = true;
    } else {
      this.allowJumpCharge = false;
    }
    if (this.shouldChargeJump && this.jumpCharge < this.jumpChargeMax ) {
      this.jumpCharge += this.jumpChargeIncrease;
    }

    this.trampoline.show();
    this.ball.show();
  }
}

export default Level;
