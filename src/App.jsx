import Highway from "./components/Highway";
import Vehicle from "./components/Vehicle";

import React, { useEffect, useRef } from "react";

const App = () => {
  const canvasRef = useRef(null);
  const highwayRef = useRef(null);
  const vehicleRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const w = 200;
    const h = window.innerHeight;

    const highway = new Highway(w / 2, w * 0.9);
    const vehicle = new Vehicle(highway.lane(1), 600);
    highwayRef.current = highway;
    vehicleRef.current = vehicle;

    function thread() {
      canvas.height = window.innerHeight;

      ctx.save();

      highway.plot(ctx);
      vehicle.plot(ctx);

      ctx.restore();
      requestAnimationFrame(thread);
    }
    thread();
  }, []);
  return <canvas ref={canvasRef} className="canvas" id="canvas" />;
};

export default App;
