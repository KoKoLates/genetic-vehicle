import NeuralNetwork from "./network";

export class User {
  constructor(self) {
    this.self = self;
    this.r = false;
    this.l = false;
    this.f = false;
    this.b = false;

    ['keyup', 'keydown'].forEach(event_type => {
      document.addEventListener(event_type, (event) => {
        this.handler(event, event_type === 'keydown');
      });
    });
  }

  handler(event, state) {
    const keys = {
      ArrowLeft: "l",
      ArrowRight: "r",
      ArrowUp: "f",
      ArrowDown: "b",
    };
    this[keys[event.key]] = state;
  }

  update() {
    this.self.motion();
  }
}

export default class NNC {
  constructor(self) {
    this.self = self;
    this.r = false;
    this.l = false;
    this.f = false;
    this.b = false;

    this.network = new NeuralNetwork([5, 6, 4]);
  }

  update() {
    const offset = this.self.sensors.read();
    const output = NeuralNetwork.forward(
      this.network, offset
    );

    this.f = output[0];
    this.l = output[1];
    this.r = output[2];
    this.b = output[3];

    this.self.motion();
  }
}
