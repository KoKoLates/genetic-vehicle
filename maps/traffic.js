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
