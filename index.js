import { Road } from "./maps/road.js";
import { Traffic } from "./maps/traffic.js"
import { Vehicle, Vehicles } from "./vehicle/vehicle.js";

import { obstacles } from "./utils.js"

// canvas
const canvas = document.getElementById("canvas");
canvas.width = 200;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// initialize road and traffic
const road = new Road(canvas.width / 2, canvas.width * 0.9);

// vehicle initialize
// const vehicle = new Vehicles(road, 1, 0.5);
const vehicle = new Vehicle(road.lane(1), 100);

// traffic initialize
const others = [
  { x: 0, y: 50 }, { x: 2, y: 20 }, { x: 1, y: -110 }
];
const traffic = new Traffic(others, road);

// keybaord event listener
document.addEventListener("keydown", (event) => {
  if (event.key === "s" || event.key === "S") {
    console.log("[Info] weights update");
    vehicle.save();
  }
  if (event.key === "d" || event.key === "D") {
    console.log("[Info] weights remove");
    vehicle.remove();
  }
  if (event.key === "f" || event.key === "F") {
    location.reload();
  }
});

// animation function
function animate() {
  canvas.height = window.innerHeight;

  traffic.update();
  vehicle.update(obstacles(road, traffic));
  // vehicle.update(road.borders);

  ctx.save();
  // ctx.translate(0, -vehicle.best.y + canvas.height * 0.7);
  ctx.translate(0, -vehicle.y + canvas.height * 0.7);

  road.plot(ctx);

  traffic.plot(ctx);
  vehicle.plot(ctx);

  ctx.restore();

  requestAnimationFrame(animate);
}

animate();
