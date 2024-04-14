class Sensor {
    constructor(car, num = 5) {
        this.car = car;
        this.num = num;
        this.length = 150;
        this.spread = Math.PI / 2;

        this.rays = [];
        this.readings = [];
    }

    update(road_borders) {
        this.#cast_rays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#get_reading(this.rays[i], road_borders)
            );
        }
    }

    #get_reading(ray, road_borders) {
        let touches = [];
        for (let i = 0; i < road_borders.length; i++) {
            const touch = get_intersect(
                ray[0],
                ray[1],
                road_borders[i][0],
                road_borders[i][1]
            );
            if (touch) {
                touches.push(touch);
            }
        }

        if (touches.length == 0) {
            return null;
        } else {
            const offsets = touches.map(event => event.offset);
            const min_offset = Math.min(...offsets);
            return touches.find(event => event.offset == min_offset);
        }
    }

    #cast_rays() {
        this.rays = [];
        for (let i = 0; i < this.num; i++) {
            const angle = lerp(
                this.spread / 2, -this.spread / 2,
                this.num == 1 ? 0.5 : i / (this.num - 1)
            ) + this.car.angle;

            const v1 = { x: this.car.x, y: this.car.y };
            const v2 = {
                x: this.car.x - Math.sin(angle) * this.length,
                y: this.car.y - Math.cos(angle) * this.length
            };
            this.rays.push([v1, v2]);
        }
    }

    draw(ctx) {
        // the sensor could be selectable invisible later
        for (let i = 0; i < this.num; i++) {
            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
}
