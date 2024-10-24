import { lerp } from "../utils/math";

class Highway {
  constructor(x, w, n = 3) {
    this.x = x;
    this.w = w;
    this.n = n;
    this.l = x - w / 2;
    this.r = x + w / 2;
    this.t = -100000;
    this.b = 100000;

    this.borders = [
      [{ x: this.l, y: this.t }, { x: this.l, y: this.b }],
      [{ x: this.r, y: this.t }, { x: this.r, y: this.b }],
    ];
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

export default Highway;