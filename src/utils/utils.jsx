/**
 * linear interpolation between two values `a` and `b`
 * the value `t` is the ratio (between 0 and 1) to interpolate 
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function intersect(p1, p2, p3, p4) {
  const denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (denominator === 0) return null;

  const t = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
  const u = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: lerp(p1.x, p2.x, t),
      y: lerp(p1.y, p2.y, t),
      offset: t,
    };
  }
  return null;
}

export function distance(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

export function collision(point, polygon) {
  let col = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = (yi > point.y) !== (yj > point.y) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

    if (intersect) col = !col;
  }
  return col;
}
