import Vehicle from "./vehicle";
import NeuralNetwork from "./network";

class Epoch {
  constructor(road, n = 1, mutate = 0.5) {
    this.vehicles = [];
    for (let i = 0; i < n; i++) {
      this.vehicles.push(new Vehicle(road.lane(1), 100));
    }
    if (localStorage.getItem("optimal")) {
      for (let i = 0; i < this.vehicles.length; i++) {
        if (i !== 0) {
          NeuralNetwork.mutate(this.vehicles[i].control.network, mutate);
        }
      }
    }
    this.optimal = this.vehicles[0];
  }

  update(obstacles) {
    for (let i = 0; i < this.vehicles.length; i++) {
      this.vehicles[i].update(obstacles)
    }
    this.update_optimal();
  }

  plot(ctx) {
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < this.vehicles.length; i++) {
      this.vehicles[i].plot(ctx, false);
    }
    ctx.globalAlpha = 1.0;
    this.optimal.plot(ctx, true);
  }

  save() {
    localStorage.setItem("optimal",
      JSON.stringify(this.optimal.control.network));
  }

  remove() {
    localStorage.removeItem("optimal");
  }

  update_optimal() {
    // minimum y and not damaged
    this.optimal = this.vehicles.find(
      (event) => event.y === Math.min(
        ...this.vehicles.map(event => event.y)
      )
    );
  }
}

export default Epoch;
