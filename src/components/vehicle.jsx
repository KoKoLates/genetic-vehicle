import User from "./control"
import Sensor from "./sensor";

import { collision } from "../utils/utils";

export default class Vehicle {
  constructor(x, y, control = 0) {
    // dimensions
    this.x = x;   // position x
    this.y = y;   // position y
    this.w = 30;  // width
    this.h = 50;  // height

    // dynamics
    this.angle = 0.0;     // rotation angle
    this.speed = 0.0;     // velocity
    this.accel = 0.25;    // acceleration
    this.friction = 0.05; // friction
    this.max_speed = 4;   // maximum velocity limitation

    // status
    this.damaged = false;
    this.polygon = this.update_polygon();
    this.control = new User(this);
    this.sensors = new Sensor(this);
  }

  update(obstacles) {
    if (!this.damaged) {
      this.sensors.update(obstacles);
      this.control.update();
      this.polygon = this.update_polygon();
      this.damaged = this.update_damaged(obstacles);
    }
  }

  plot(ctx, sensor = false) {
    ctx.beginPath();
    ctx.fillStyle = this.damaged ? "#808080" : "blue";
    this.polygon.forEach((point, index) => {
      index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
    });
    ctx.fill();
    this.sensors.plot(ctx, sensor);
  }

  motion() {
    const { f, b, l, r } = this.control;

    if (f && this.speed < this.max_speed) this.speed += this.accel;
    if (b && this.speed > -this.max_speed / 2) this.speed -= this.accel;

    this.speed -= Math.sign(this.speed) * this.friction;
    if (Math.abs(this.speed) < this.friction) this.speed = 0;

    if (this.speed !== 0) {
      const rotate = this.speed > 0 ? 1 : -1;
      if (l) this.angle += 0.03 * rotate;
      if (r) this.angle -= 0.03 * rotate;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  update_polygon() {
    const radius = Math.hypot(this.w, this.h) / 2;
    const rotate = Math.atan2(this.w, this.h);

    return [
      {
        x: this.x - Math.sin(this.angle - rotate) * radius,
        y: this.y - Math.cos(this.angle - rotate) * radius
      },
      {
        x: this.x - Math.sin(this.angle + rotate) * radius,
        y: this.y - Math.cos(this.angle + rotate) * radius
      },
      {
        x: this.x - Math.sin(Math.PI + this.angle - rotate) * radius,
        y: this.y - Math.cos(Math.PI + this.angle - rotate) * radius
      },
      {
        x: this.x - Math.sin(Math.PI + this.angle + rotate) * radius,
        y: this.y - Math.cos(Math.PI + this.angle + rotate) * radius
      }
    ];
  }

  update_damaged(obstacles) {
    return obstacles.some(poly => collision(poly, this.polygon));
  }
}
