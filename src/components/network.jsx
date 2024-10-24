import { lerp } from "../utils/utils";

class Layer {
  constructor(input_dims, output_dims) {
    this.dims = [input_dims, output_dims];

    this.weights = [];
    for (let i = 0; i <= input_dims; i++) { // here count bias as w0
      this.weights[i] = new Array(output_dims);
    }

    // initialize
    for (let i = 0; i <= input_dims; i++) {
      for (let j = 0; j < output_dims; j++) {
        this.weights[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  static forward(layer, inputs) {
    let outputs = [];
    for (let i = 0; i < layer.dims[1]; i++) {
      let sum = 0;
      for (let j = 1; j <= layer.dims[0]; j++) {
        sum += inputs[j - 1] * layer.weights[j][i];
      }
      outputs.push(sum > layer.weights[0][i] ? 1 : 0);
    }
    return outputs;
  }
}

export default class NeuralNetwork {
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
