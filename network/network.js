import { lerp } from "../utils.js";
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

  static forward(network, inputs) {
    let output = Layer.forward(network.layers[0], inputs);
    for (let i = 1; i < network.layers.length; i++) {
      output = Layer.forward(network.layers[i], output);
    }
    return output;
  }

  static mutate(network, amount = 1) {
    network.layers.forEach((layer) => {
      for (let i = 0; i <= layer.dims[0]; i++) {
        for (let j = 0; j < layer.dims[1]; j++) {
          layer.weights[i][j] = lerp(
            layer.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}
