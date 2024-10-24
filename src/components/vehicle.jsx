import KBC from "./control";
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
    this.polygon = this.#update_polygon();
    this.sensors = new Sensor(this);



    this.control = new KBC(this);
  }

  update(obstacles) {
    if (!this.damaged) {
      this.sensors.update(obstacles);
      this.control.update();
      this.polygon = this.#update_polygon();
      this.damaged = this.#update_damaged(obstacles);
    }
  }

  plot(ctx, show_sensors = true) {
    ctx.beginPath();
    ctx.fillStyle = this.damaged ? "#808080" : "blue";
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    this.polygon.forEach((poly) => {
      ctx.lineTo(poly.x, poly.y)
    });
    ctx.fill();

    // plot the sensors
    this.sensors.plot(ctx, show_sensors);
  }

  motion() {
    if (this.speed < this.max_speed) {
      if (this.control.f) {
        this.speed += this.accel;
      }
    }
    if (this.speed > -this.max_speed / 2) {
      if (this.control.b) {
        this.speed -= this.accel;
      }
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (this.speed !== 0) {
      const rotate = this.speed > 0 ? 1 : -1;
      if (this.control.l) {
        this.angle += 0.03 * rotate;
      }
      if (this.control.r) {
        this.angle -= 0.03 * rotate;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
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

  #update_damaged(obstacles) {
    for (const poly of obstacles) {
      if (collision(poly, this.polygon)) {
        return true;
      }
    }
    return false;
  }
}
