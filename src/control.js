
class Control {
    constructor(keyboard = false) {
        this.f = false; // forward
        this.b = false; // backword
        this.r = false; // right
        this.l = false; // left

        if (keyboard) this.#keyboard_control()
    }

    #keyboard_control() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.f = true;
                    break;
                case "ArrowDown":
                    this.b = true;
                    break;
                case "ArrowLeft":
                    this.l = true;
                    break;
                case "ArrowRight":
                    this.r = true;
                    break;
            }
        }

        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.f = false;
                    break;
                case "ArrowDown":
                    this.b = false;
                    break;
                case "ArrowLeft":
                    this.l = false;
                    break;
                case "ArrowRight":
                    this.r = false;
                    break;
            }
        }

    }
}
