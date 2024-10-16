import { Sensor } from "./sensor.js";
import { KBC, NNC, MPC, PID } from "./control.js"
import { polygon_intersect } from "../math.js";

import { NeuralNetwork } from "../network/network.js";

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
    this.polygon = this.#update_polygon();
    this.sensors = new Sensor(this);

    // controller type
    if (control === 0) {
      this.control = new KBC(this);
    } else {
      this.control = new NNC(this);
    }
    // this.control = new PID(this);

    // can add event listenr for sensors showup option
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

export class Vehicles {
  /**
   * The class only for genetic neural network control
   */
  constructor(road, n = 1, mutate = 0.5) {
    if (n !== 1 && control !== 1) {
      // if the generate number is lager than 1
      // using neural network control in force
      control = 1;
    }
    this.vehicles = [];
    for (let i = 0; i < n; i++) {
      this.vehicles.push(new Vehicle(road.lane(1), 100, 1));
    }
    if (control === 1 && localStorage.getItem("best")) {
      for (let i = 0; i < this.vehicles.length; i++) {
        this.vehicles[i].control.network = JSON.parse(
          localStorage.getItem("best")
        );
        if (i !== 0) {
          NeuralNetwork.mutate(this.vehicles[i].control.network, mutate);
        }
      }
    }
    this.best = this.vehicles[0];
  }

  update(obstacles) {
    for (let i = 0; i < this.vehicles.length; i++) {
      this.vehicles[i].update(obstacles)
    }
    this.#find_best();
  }

  plot(ctx) {
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < this.vehicles.length; i++) {
      this.vehicles[i].plot(ctx, false);
    }
    ctx.globalAlpha = 1.0;
    this.best.plot(ctx, true);
  }

  save() {
    localStorage.setItem("best", 
      JSON.stringify(this.best.control.network));
  }

  remove() {
    localStorage.removeItem("best");
  }

  #find_best() {
    // minimum y and not damaged
    this.best = this.vehicles.find(
      (event) => event.y === Math.min(
        ...this.vehicles.map(event => event.y)
      ) && !event.damaged
    );
  }
}
