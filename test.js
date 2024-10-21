import { Road, Traffic } from './env.js';
import { Vehicle } from "./vehicle/vehicle.js";

import { obstacles } from './utils.js';


// canvas
const canvas = document.getElementById("canvas");
canvas.width = 200;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");


const road = new Road(canvas.width / 2, canvas.width * 0.9);

const vehicle = new Vehicle(road.lane(1), 100, 1);

const others = [
  { x: 0, y: 50 }, { x: 2, y: 20 }, { x: 1, y: -110 }
];
const traffic = new Traffic(others, road);

function animate() {
  canvas.height = window.innerHeight;

  traffic.update();
  vehicle.update(obstacles(road, traffic));

  ctx.save();
  ctx.translate(0, -vehicle.y + canvas.height * 0.7);

  road.plot(ctx);

  traffic.plot(ctx);
  vehicle.plot(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}

animate();
