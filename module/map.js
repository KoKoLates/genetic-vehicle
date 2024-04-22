
import { lerp } from "./math.js";
import { GVehicle } from "./vehicle/vehicle.js";

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
    ctx.strokeStyle = "white";

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
  constructor(file_path, road) {
    this.vehicle = [];
    this.initial = this.#initialize(file_path, road);
  }

  async update() {
    await this.initial;
    for (let i = 0; i < this.vehicle.length; i++) {
      this.vehicle[i].update();
    }
  }

  async plot(ctx) {
    await this.initial;
    for (let i = 0; i < this.vehicle.length; i++) {
      this.vehicle[i].plot(ctx);
    }
  }

  async vehicles() {
    await this.initial;
    return this.vehicle;
  }

  async #initialize(file_path, road) {
    try {
      const response = await fetch(file_path);
      if (!response.ok) {
        throw new Error(
          `[Error] Network Response Issue: ${response.statusText}.`
        );
      }
      const poses = await response.json();
      poses.forEach((pose) => {
        this.vehicle.push(new GVehicle(road.lane(pose.x), pose.y));
      });
    } catch (error) {
      console.log(error);
    }
  }
}
