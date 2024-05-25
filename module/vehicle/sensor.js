
import { lerp, intersect } from "../math.js";

export class Sensor {
  constructor(self, count = 5) {
    this.self = self;
    this.count = count
    this.length = 150;
    this.spread = Math.PI / 2;

    this.beams = [];
    this.reads = [];
  }

  update(obstacles) {
    this.#update_beams();
    this.reads = []; // clean
    this.beams.forEach((beam) => {
      this.reads.push(
        this.#reading(beam, obstacles)
      );
    });
  }

  plot(ctx, show = false) {
    if (!show) return

    this.beams.forEach((beam, index) => {
      let reading = beam[1];
      if (this.reads[index]) {
        reading = this.reads[index]
      }

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

  /**
   * 
   * @param {Array} beam one beam in all sensors 
   * @param {*} obstacles 
   */
  #reading(beam, obstacles) {
    let touches = [];
    obstacles.forEach((poly) => {
      const touch = intersect(
        beam[0], beam[1], poly[0], poly[1]
      ) ;
      if (touch) {
        touches.push(touch);
      }
    });
    if (touches.length !== 0) {
      const offset = touches.map(event => event.offset);
      const minima = Math.min(...offset);
      return touches.find(event => event.offset === minima);
    }
    return null;
  }

  #update_beams() {
    this.beams = [];
    for (let i = 0; i < this.count; i++) {
      const angle = lerp(
        this.spread / 2, -this.spread / 2,
        this.count === 1 ? 0.5 : i / (this.count - 1) 
      ) + this.self.angle;

      const v1 = {x: this.self.x, y: this.self.y};
      const v2 = {
        x: this.self.x - Math.sin(angle) * this.length,
        y: this.self.y - Math.cos(angle) * this.length
      };
      this.beams.push([v1, v2]);
    }
  }
}
