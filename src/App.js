import { useEffect, useRef } from "react";

import Highway from "./components/highway";
// import Vehicle from "./components/vehicles";
import Traffic from "./components/traffic";

import Epoch from "./components/epoch";

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = window.innerHeight;

    const highway = new Highway(canvas.width / 2, canvas.width * 0.9, 3);
    // const vehicles = new Vehicle(highway.lane(1), 500);
    const vehicles = new Epoch(highway, 100, 0.1);

    const others = [
      { x: 0, y: 50 }, { x: 2, y: 20 }, { x: 1, y: -130 },
      { x: 0, y: -110 }, { x: 2, y: -310 },
      { x: 0, y: -470 }, { x: 1, y: -500 },
      { x: 2, y: -675 }, { x: 1, y: -750 }
    ]
    const traffic = new Traffic(others, highway);

    // keybaord event listener
    document.addEventListener("keydown", (event) => {
      if (event.key === "s" || event.key === "S") {
        console.log("[Info] weights update");
        vehicles.save();
      }
      if (event.key === "d" || event.key === "D") {
        console.log("[Info] weights remove");
        vehicles.remove();
      }
      if (event.key === "f" || event.key === "F") {
        window.location.reload();
      }
    });

    const threading = () => {
      canvas.height = window.innerHeight;

      traffic.update();
      vehicles.update(traffic.obstacles(highway));

      ctx.save();
      // ctx.translate(0, -vehicles.y + canvas.height * 0.7);
      ctx.translate(0, -vehicles.optimal.y + canvas.height * 0.7);

      highway.plot(ctx);
      traffic.plot(ctx);
      vehicles.plot(ctx);

      ctx.restore();
      requestAnimationFrame(threading);
    };
    threading()
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="canvas" id="canvas"></canvas>
    </div>
  )
};

export default App;
