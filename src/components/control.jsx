class User {
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

export default User;
