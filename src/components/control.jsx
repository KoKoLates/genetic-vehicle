export default class KBC {
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
