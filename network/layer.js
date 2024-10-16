
export class Layer {
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
