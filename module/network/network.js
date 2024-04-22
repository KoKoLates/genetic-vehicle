
import { Layer } from "./layer.js";

export class NeuralNetwork {
  constructor(cfg) {
    this.layers = [];
    for (let i = 0; i < cfg.length - 1; i++) {
      this.layers.push(
        new Layer(cfg[i], cfg[i + 1])
      );
    }
  }

  forward(inputs) {
    let output = this.layers[0].forward(inputs);
    for (let i = 1; i < this.layers.length; i++) {
      output = this.layers[i].forward(output);
    }
    return output;
  }
}
