class Vehicle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        this.angle = 0;
        this.speed = 0;
        this.accel = 0.2;
        this.friction = 0.05;
        this.control = new Control();
    }

    update() {
        if (this.control.f) {
            this.speed += this.accel;
        }
        if (this.control.b) {
            this.speed -= this.accel;
        }

        if (this.speed > 3) {
            this.speed = 3;
        }
        if (this.speed < -1.5) {
            this.speed = -1.5
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed !=0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.control.l) {
                this.angle += 0.03 * flip;
            }
            if (this.control.r) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.w / 2,
            - this.h / 2,
            this.w, this.h
        );
        ctx.fill();
        ctx.restore();
    }
}