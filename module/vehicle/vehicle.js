import { Sensor } from "./sensor.js";
import { KBC, NNC, MPC } from "./control.js"
import { polygon_intersect } from "../math.js";

export class Vehicle {
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
    this.sensors = new Sensor(this, 5);
    this.polygon = this.#update_polygon();

    // controller type
    if (control === 0) {
      this.control = new KBC(this);
    } else {
      this.control = new NNC(this);
    }
  }

  update(obstacles) {
    if (!this.damaged) {
      this.control.update()
      this.sensors.update(obstacles);
      this.polygon = this.#update_polygon();
      this.damaged = this.#update_damaged(obstacles);
    }
  }

  plot(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.damaged ? "gray" : "blue";
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    this.polygon.forEach((poly) => {
      ctx.lineTo(poly.x, poly.y)
    });
    ctx.fill();

    this.sensors.plot(ctx, true);
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
    if (this.speed != 0) {
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
      if (polygon_intersect(poly, this.polygon)) {
        return true;
      }
    }
    return false;
  }
}


export class GVehicle {
  // a class for group vehicle which consist of traffic with indicated map
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
