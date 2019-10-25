import 'normalize.css';
import '../sass/global.scss';

import 'p5';
import Matter from 'matter-js';
import Level from './components/Level';

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;

const canvasWidth = window.innerWidth / 2;
const canvasHeight = window.innerHeight;

let engine;
let render;
let world;

let level;
window.setup = () => {
  engine = Engine.create();
  world = engine.world;
  render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      showAngleIndicator: true,
      width: canvasWidth,
      height: canvasHeight,
    },
  });

  Render.run(render);

  for (let i = 0; i < 1000; i++) {
    loop();
    if (i === 999) {
      start();
    }
  }
};

window.mousePressed = () => {
  level.startCharge(); // TODO: should make this a subscription
};

window.mouseReleased = () => {
  level.handleClick(); // TODO: should make this a subscription
};

const start = () => {
  runGame();
  level = new Level(canvasWidth, canvasHeight, {world, engine});
  level.start();
};

const draw = () => {
  background(51);
  level.render();
};

// frame rate
const drawFrequence = 1000 / 60;

// engine frame rate; doubled to help with collision detection
const engineFrequence = 1000 / 120;

const runGame = () => {
  setInterval(loop, engineFrequence);
  setInterval(draw, drawFrequence);
};

const loop = (delta) => {
  Engine.update(engine, engineFrequence);
  if (level) {
    level.loop();
  }
};
