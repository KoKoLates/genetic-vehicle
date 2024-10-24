export default class Highway {
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
      const x = this.l + ((this.r - this.l) * i) / this.n;
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.t);
      ctx.lineTo(x, this.b);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}
