
export class Layer {
  constructor(input_dim, output_dim) {
    this.layer = [input_dim, output_dim];

    this.weights = [];
    for (let i = 0; i <= input_dim; i++) { // here count bias as x0
      this.weights[i] = new Array(output_dim);
    }

    // initialize
    for (let i = 0; i <= this.input_dim; i++) {
      for (let j = 0; j < this.output_dim; j++) {
        this.weights[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  forward(inputs) {
    
  }
}
