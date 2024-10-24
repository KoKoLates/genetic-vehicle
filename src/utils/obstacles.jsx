export function obstacles(highway, traffic) {
  return [
    ...highway.borders,
    ...traffic.vehicle.flatMap(vehicle =>
      vehicle.polygon.map((poly, i) => [poly, vehicle.polygon[(i + 1) % vehicle.polygon.length]])
    )
  ];
}
