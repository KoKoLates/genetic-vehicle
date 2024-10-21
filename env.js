import { lerp } from './utils.js';

export class Road {
  constructor(x, w, n = 3) {
    this.x = x;
    this.w = w;
    this.n = n; // lane number

    this.l = x - w / 2; // left
    this.r = x + w / 2; // right
    this.t = -100000;   // top
    this.b = 100000;    // bottom

    const v1 = { x: this.l, y: this.t }; // top left
    const v2 = { x: this.r, y: this.t }; // top right
    const v3 = { x: this.l, y: this.b }; // bottom left
    const v4 = { x: this.r, y: this.b }; // bottom right

    this.borders = [
      [v1, v3] /** left border */,
      [v2, v4] /** right border */
    ]
  }

  lane(index) {
    const w = this.w / this.n;
    return this.l + w / 2 + Math.min(index, this.n - 1) * w;
  }

  plot(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffffff";

    for (let i = 1; i < this.n; i++) {
      const x = lerp(this.l, this.r, i / this.n);

      // plot middle dash line
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.t);
      ctx.lineTo(x, this.b);
      ctx.stroke();
    }

    // plot side border
    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    })
  }
}

export class Traffic {
  constructor(config, road) {
    this.vehicle = [];
    config.forEach((pose) => {
      this.vehicle.push(new Other(road.lane(pose.x), pose.y));
    });
  }

  update() {
    for (let i = 0; i < this.vehicle.length; i++) {
      this.vehicle[i].update();
    }
  }

  plot(ctx) {
    for (let i = 0; i < this.vehicle.length; i++) {
      this.vehicle[i].plot(ctx);
    }
  }
}

export class Other {
  constructor(x, y, max_speed = 3) {
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 50;

    this.angle = 0;
    this.speed = 0;
    this.accel = 0.25;
    this.max_speed = max_speed;

    this.polygon = this.#update_polygon();
  }

  update() {
    this.polygon = this.#update_polygon()

    // update dynamic from simple controller
    if (this.speed < this.max_speed) {
      this.speed += this.accel;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  plot(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 0; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
  }

  #update_polygon() {
    const points = [];
    const radius = Math.hypot(this.w, this.h) / 2;
    const rotate = Math.atan2(this.w, this.h);

    points.push({
      x: this.x - Math.sin(this.angle - rotate) * radius,
      y: this.y - Math.cos(this.angle - rotate) * radius
    });
    points.push({
      x: this.x - Math.sin(this.angle + rotate) * radius,
      y: this.y - Math.cos(this.angle + rotate) * radius
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - rotate) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - rotate) * radius
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + rotate) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + rotate) * radius
    });
    return points;
  }
}
