
import { Road, Traffic } from "./map.js";
import { Vehicle } from "./vehicle/vehicle.js";


// canvas
const canvas = document.getElementById("canvas");
canvas.width = 200;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// initialize road and traffic
const avenues = new Road(canvas.width / 2, canvas.width * 0.9);
const traffic = new Traffic("./maps/test.json", avenues);
const vehicle = new Vehicle(avenues.lane(1), 100);

// traffic.vehicles().then((array) => {
//   array.forEach(v => {
//     const results = v.polygon.map((point, index) => {
//       const next = (index + 1) % v.polygon.length;
//       return [point, v.polygon[next]]
//     })
//     console.log(results);
//   })
// })

// animation function
function animate() {
  if (vehicle.damaged) {
    const response = confirm("Damaged! Re-start?");
    if (response) {
      location.reload();
    }
    return
  }

  vehicle.update(avenues.borders);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(0, -vehicle.y + canvas.height * 0.7);

  // traffic.initial.then(() => {
  //   traffic.update();
  //   traffic.plot(ctx);
  // });

  avenues.plot(ctx);
  vehicle.plot(ctx);

  ctx.restore();

  requestAnimationFrame(animate);
}

animate();
