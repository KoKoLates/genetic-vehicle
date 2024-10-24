import { lerp, intersect } from "../utils/utils";

class Sensor {
  constructor(self, count = 5, theta = 2) {
    this.self = self;
    this.count = count
    this.beams = [];
    this.reads = [];
    this.length = 150;
    this.spread = Math.PI / theta;
  }

  update(obstacles) {
    this.update_beams();
    this.reads = this.beams.map((beam) => this.reading(beam, obstacles));
  }

  read() {
    return this.reads.map(event => (event ? 1 - event.offset : 0));
  }

  plot(ctx, show = false) {
    if (!show) return

    this.beams.forEach((beam, index) => {
      const reading = this.reads[index] || beam[1];

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffff00";
      ctx.moveTo(beam[0].x, beam[0].y);
      ctx.lineTo(reading.x, reading.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#2e282a";
      ctx.moveTo(beam[1].x, beam[1].y);
      ctx.lineTo(reading.x, reading.y);
      ctx.stroke();
    });
  }

  reading(beam, obstacles) {
    const touches = obstacles.flatMap(poly => {
      const touch = intersect(beam[0], beam[1], poly[0], poly[1]);
      return touch ? [touch] : [];
    });

    if (touches.length === 0) return null;

    return touches.reduce((closest, touch) =>
      touch.offset < closest.offset ? touch : closest
    );
  }

  update_beams() {
    this.beams = Array.from({ length: this.count }, (_, i) => {
      const angle = lerp(
        this.spread / 2, -this.spread / 2,
        this.count === 1 ? 0.5 : i / (this.count - 1)
      ) + this.self.angle;

      const v1 = { x: this.self.x, y: this.self.y };
      const v2 = {
        x: this.self.x - Math.sin(angle) * this.length,
        y: this.self.y - Math.cos(angle) * this.length
      };

      return [v1, v2];
    });
  }
}

export default Sensor;
