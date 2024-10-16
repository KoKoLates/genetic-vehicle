export function obstacles(road, traffic) {
  let borders = [...road.borders];
  traffic.vehicle.forEach((vehicle) => {
    const polygon = vehicle.polygon;
    polygon.forEach((poly, index) => {
      borders.push([poly, polygon[(index + 1) % polygon.length]]);
    });
  });
  return borders;
}
