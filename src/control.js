class Control {
    constructor() {
        this.f = false;
        this.l = false;
        this.r = false;
        this.b = false;

        this.#keyboard();
    }

    #keyboard() {
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