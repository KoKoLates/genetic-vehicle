import { useEffect, useRef } from "react";
import Highway from "./components/highway";
import Vehicle from "./components/vehicle";

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = window.innerHeight;

    let highway = new Highway(canvas.width / 2, canvas.width * 0.9, 3);
    // highwayRef.current = highway;
    let vehicle = new Vehicle(highway.lane(1), 500);

    const threading = () => {
      canvas.height = window.innerHeight;

      vehicle.update(highway.borders);

      ctx.save();
      ctx.translate(0, -vehicle.y + canvas.height * 0.7);

      vehicle.plot(ctx);
      highway.plot(ctx);

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
