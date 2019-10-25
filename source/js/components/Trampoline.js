import Matter from 'matter-js';
import 'p5';

const Body = Matter.Body;
const Composites = Matter.Composites;
const Bodies = Matter.Bodies;

class Trampoline {
  constructor(startX, startY, columns, width, height) {
    // add bodies
    this.x = startX;
    this.y = startY;
    let group = Body.nextGroup(true);
    const gap = 0;
    const sectionWidth = ((width - gap * (columns - 1)) / columns) * 1.95;
    this.body = Composites.stack(
      startX,
      startY,
      columns,
      1,
      gap,
      0,
      (x, y, index) => {
        return Bodies.rectangle(x, y, sectionWidth, height, {
          collisionFilter: {group: group},
          restitution: 0.001,
          render: {
            fillStyle: '#575375',
          },
        });
      }
    );

    Composites.chain(this.body, 0.05, 0, -0.05, 0, {
      stiffness: 1,
      length: 0,
      render: {
        visible: true,
      },
    });
    this.body.bodies.forEach((body) => (body.label = 'Trampoline'));
  }

  show() {
    const bodyFirst = this.body.bodies[0];
    const bodyCenter = this.body.bodies[
      Math.floor(this.body.bodies.length / 2)
    ];
    const bodyLast = this.body.bodies[this.body.bodies.length - 1];

    const {x: x1, y: y1} = bodyFirst.position;
    const {x: x2, y: y2} = bodyLast.position;
    const {x: cx1, y: cy1} = bodyCenter.position;

    push();
    translate(this.x, this.y);
    strokeWeight(15);
    // line(0, 0, x2 - x1, 0)
    noFill();
    // bezier(0, 0, cx1 - x1, -(y1 - cy1), cx1 - x1, -(y1 - cy1), cx1 - x1, -(y1 - cy1))
    stroke(255);
    pop();
  }
}

export default Trampoline;
