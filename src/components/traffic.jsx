class Other {
  constructor(x, y, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 50;

    this.angle = 0;
    this.speed = 0;
    this.accel = 0.25;
    this.maxSpeed = maxSpeed;

    this.polygon = this.update_polygon();
  }

  update() {
    if (this.speed < this.maxSpeed) this.speed += this.accel;
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
    this.polygon = this.update_polygon();
  }

  plot(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    this.polygon.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.fill();
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
}

export default class Traffic {
  constructor(config, highway) {
    this.vehicle = config.map(pose => new Other(highway.lane(pose.x), pose.y));
  }

  update() {
    this.vehicle.forEach(vehicle => vehicle.update());
  }

  plot(ctx) {
    this.vehicle.forEach(vehicle => vehicle.plot(ctx));
  }

  obstacles(highway) {
    return [
      ...highway.borders,
      ...this.vehicle.flatMap(vehicle =>
        vehicle.polygon.map((poly, i) => [poly, vehicle.polygon[(i + 1) % vehicle.polygon.length]])
      )
    ];
  }
}
