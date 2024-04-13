
function lerp(a, b, t) {
    return a + (b - a) * t;
}

function get_intersect(a, b, c, d) {
    const tt_top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
    const uu_top = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
    const bottom = (d.y - a.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

    if (bottom != 0) {
        const t = tt_top / bottom;
        const u = uu_top / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(a.x, b.x, t),
                y: lerp(a.y, b.y, t),
                offset: t
            }
        }
    }
    return null;
}
