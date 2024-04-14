
class NeuralNetwork {
    constructor(neurons) {
        this.network = [];
        for (let i = 0; i < neurons.length - 1; i++) {
            this.network.push(
                new Layer(neurons[i], neurons[i + 1])
            );
        }
    }

    static forward(input, networks) {
        let output = Layer.forward(input, networks.network[0]);
        for (let i = 1; i < networks.network.length; i++) {
            output = Layer.forward(
                output, networks.network[i]
            );
        }
        return output;
    }

    static mutate(network, amount = 1) {
        network.network.forEach((layer) => {
            for (let i = 0; i < layer.biases.length; i++) {
                layer.biases[i] = lerp(
                    layer.biases[i],
                    Math.random() * 2 - 1,
                    amount
                );
            }
            for (let i = 0; i < layer.weights/this.length; i++) {
                for (let j = 0; j < layer.weights[i].length; j++) {
                    layer.weights[i][j] = lerp(
                        layer.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    );
                }
            }
        })
    }
}

class Layer {
    constructor(input_num, output_num) {
        this.input = new Array(input_num);
        this.output = new Array(output_num);
        this.biases = new Array(output_num); // can biases combined into weights

        this.weights = [];
        for (let i = 0; i < input_num; i++) {
            this.weights[i] = new Array(output_num);
        }

        Layer.#randomize(this);
    }

    static #randomize(layer) {
        for (let i = 0; i < layer.input.length; i++) {
            for (let j = 0; j < layer.output.length; j++) {
                layer.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < layer.biases.length; i++) {
            layer.biases[i] = Math.random() * 2 - 1;
        }
    }

    static forward(inputs, layer) {
        for (let i = 0; i < layer.input.length; i++) {
            layer.input[i] = inputs[i];
        }

        for (let i = 0; i < layer.output.length; i++) {
            let sum = 0;
            for (let j = 0; j < layer.input.length; j++) {
                sum += layer.input[j] * layer.weights[j][i];
            }
            layer.output[i] = sum > layer.biases[i] ? 1 : 0;
        }
        return layer.output;
    }
}
