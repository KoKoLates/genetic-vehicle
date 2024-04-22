
import { NeuralNetwork } from "../network/network.js"

export class NNC {
  // neural network controller
  constructor(self) {
    this.f = false; // forward
    this.b = false; // backward
    this.r = false; // right
    this.l = false; // left
    this.self = self;

    this.network = new NeuralNetwork([5, 6, 4]);
  }

  update() {
    const offset = this.self.sensors.reads.map(
      event => event === null ? 0 : 1 - event.offset
    );
    const output = this.network.forward(offset);

    this.f = output[0];
    this.l = output[1];
    this.r = output[2];
    this.b = output[3];

    this.self.motion();
  }
}

export class MPC {
  // model predictive controller
  constructor(self) {
    this.f = false; // forward
    this.b = false; // backward
    this.r = false; // right
    this.l = false; // left
    this.self = self;
  }

  update() {
    
  }
}

export class KBC {
  // keyboard controller 
  constructor(self) {
    this.f = false; // forward
    this.b = false; // backward
    this.r = false; // right
    this.l = false; // left
    this.self = self;

    // keyboard event handler
    document.onkeyup = (event) => {
      this.#handler(event, false);
    }
    document.onkeydown = (event) => {
      this.#handler(event, true);
    }
  }

  update() {
    this.self.motion();
  }

  #handler(event, state) {
    const keys = {
      ArrowUp: "f",
      ArrowDown: "b", 
      ArrowLeft: "l",
      ArrowRight: "r"
    };

    this[keys[event.key]] = state;
  }
}
