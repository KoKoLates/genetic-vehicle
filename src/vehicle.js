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
        this.max_speed = 4

        this.sensors = new Sensor(this, 5)
        this.control = new Control(true);
    }

    update(road_borders) {
        this.#run();
        this.sensors.update(road_borders);
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

        this.sensors.draw(ctx);
    }

    #run() {
        if (this.control.f) {
            this.speed += this.accel;
        }
        if (this.control.b) {
            this.speed -= this.accel;
        }

        if (this.speed > this.max_speed) {
            this.speed = this.max_speed;
        }
        if (this.speed < -this.max_speed / 2) {
            this.speed = -this.max_speed / 2
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

        if (this.speed != 0) {
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
}
