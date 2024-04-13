class Road {
    constructor(x, w, count = 3) {
        this.x = x;
        this.w = w;
        this.lane_count = count;

        this.l = x - w / 2;
        this.r = x + w / 2;

        const inf = 1000000;
        this.t = -inf; // top
        this.b = inf; // bottom

        const v1 = {x: this.l, y: this.t}; // top left
        const v2 = {x: this.r, y: this.t}; // top right
        const v3 = {x: this.l, y: this.b}; // bottom left
        const v4 = {x: this.r, y: this.b}; // bottom right

        this.borders = [
            [v1, v3], [v2, v4]
        ];
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for (let i = 1; i < this.lane_count; i++) {
            const x = lerp(
                this.l, this.r,
                i / this.lane_count
            );

            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(x, this.t);
            ctx.lineTo(x, this.b);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach((border) => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        })
    }

    center(lane_index) {
        const w = this.w / this.lane_count;
        return this.l + w / 2 +
            Math.min(lane_index, this.lane_count - 1) * w;
    }
}
