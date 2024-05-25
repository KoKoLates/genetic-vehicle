
import { Road, Traffic } from "./map.js";
import { Vehicle } from "./vehicle/vehicle.js";

// canvas
const canvas = document.getElementById("canvas");
canvas.width = 200;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// initialize road and traffic
const road = new Road(canvas.width / 2, canvas.width * 0.9);

// vehicle initialize
const vehicle = new Vehicle(road.lane(1), 100);

// traffic initialize
const arrange = [
  {x: 0, y: 50}, {x: 2, y: 20}
];
const traffic = new Traffic(arrange, road);

function obstacles(road, traffic) {
  let borders = [...road.borders];
  traffic.vehicle.forEach((vehicle) => {
    const polygon = vehicle.polygon;
    polygon.forEach((poly, index) => {
      borders.push([poly, polygon[(index + 1) % polygon.length]]);
    });
  });
  return borders;
}

// animation function
function animate() {
  if (vehicle.damaged) {
    if (confirm("You have crashed. Would you like to restart?")) {
      location.reload();
    }
    return
  }

  traffic.update();
  vehicle.update(obstacles(road, traffic));

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(0, -vehicle.y + canvas.height * 0.7);

  road.plot(ctx);

  traffic.plot(ctx);
  vehicle.plot(ctx);

  ctx.restore();

  requestAnimationFrame(animate);
}

animate();
