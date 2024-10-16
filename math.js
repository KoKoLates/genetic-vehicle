/**
 * A basic linear interpolation
 * @param {float} a start point
 * @param {float} b terminate point
 * @param {float} t weighted interval
 * @returns the interpolated points
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * calculate the intersection of two lines
 * @param {object} a line 1 start point
 * @param {object} b line 1 terminated point
 * @param {object} c line 2 start point
 * @param {object} d line 2 terminated point
 * @returns the intersect start point and terminal
 * and the length of `non-intersected` region
 */
export function intersect(a, b, c, d) {
  const tt_top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
  const uu_top = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

  if (bottom !== 0) {
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

/**
 * check two polygons (lines) are intersected or not
 * @param {object} P1 polygon 1
 * @param {object} P2 polygon 2
 * @return boolean of intersected or not
 */
export function polygon_intersect(P1, P2) {
  for (let i = 0; i < P1.length; i++) {
    for (let j = 0; j < P2.length; j++) {
      const touch = intersect(
        P1[i], P1[(i + 1) % P1.length],
        P2[i], P2[(i + 1) % P2.length],
      );
      if (touch) return true;
    }
  }
  return false;
}

