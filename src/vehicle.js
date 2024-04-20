class Vehicle {
    constructor(x, y, w, h, max_speed = 3, dummy = true) {
        this.x = x; // x coordinate
        this.y = y; // y coordinate
        this.w = w; // dimension of width
        this.h = h; // dimension of height

        this.angle = 0;
        this.speed = 0;
        this.accel = 0.25;
        this.friction = 0.05;
        this.max_speed = max_speed;

        this.dummy = dummy;
        this.damaged = false;
        
        if (!this.dummy) {
            this.neural_control = true;
            this.sensors = new Sensor(this, 5);
            this.network = new NeuralNetwork(
                [this.sensors.num, 6, 4]
            );
        }
        this.control = new Control(this.dummy, false);
    }

    update(road_borders, traffic) {
        if (!this.damaged) {
            this.#movement();
            this.polygon = this.#create_polygon();
            this.damaged = this.#assess_damage(road_borders, traffic);
        }
        if (this.sensors) {
            this.sensors.update(road_borders, traffic);
            const offsets = this.sensors.readings.map(
                event => event === null ? 0 : 1 - event.offset
            );
            const output = NeuralNetwork.forward(offsets, this.network);
            
            if (this.neural_control) {
                this.control.f = output[0];
                this.control.l = output[1];
                this.control.r = output[2];
                this.control.b = output[3];
            }
        }
    }

    draw(ctx, sensor = false) {
        ctx.beginPath();
        ctx.fillStyle = this.damaged ? "gray" : this.dummy ? "red" : "blue";
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 0; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }
        ctx.fill();

        if (this.sensors && sensor) {
            this.sensors.draw(ctx);
        }
    }

    #movement() {
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

    #assess_damage(borders, traffic) {
        for (let i = 0; i < borders.length; i++) {
            if (polygon_intersect(this.polygon, borders[i])) {
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polygon_intersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    #create_polygon() {
        const points = [];
        const radian = Math.hypot(this.w, this.h) / 2;
        const alpha = Math.atan2(this.w, this.h);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * radian,
            y: this.y - Math.cos(this.angle - alpha) * radian
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * radian,
            y: this.y - Math.cos(this.angle + alpha) * radian
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * radian,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * radian
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * radian,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * radian
        });
        return points;
    }
}
