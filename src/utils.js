
function lerp(a, b, t) {
    return a + (b - a) * t;
}

function get_intersect(a, b, c, d) {
    const tt_top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
    const uu_top = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
    const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

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

function polygon_intersect(poly1, poly2) {
    /* check the two polygon: vehicle and road have
        intersection in four side lines */
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = get_intersect(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length]
            );
            if (touch) {
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}  
