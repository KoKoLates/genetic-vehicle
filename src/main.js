const canvas = document.getElementById("canvas")
canvas.height = window.innerHeight;
canvas.width = 200;
const ctx = canvas.getContext("2d");

// const networkCanvas = document.getElementById("networkCanvas");
// networkCanvas.width = 300;
// const networkCtx = networkCanvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const vehicles = generate_vehicle(1);

let best = vehicles[0];
if (localStorage.getItem("best")) {
    for (let i = 0; i < vehicles.length; i++){
        vehicles[i].network = JSON.parse(
            localStorage.getItem("best")
        );
        if ( i !== 0) {
            NeuralNetwork.mutate(vehicles[i].network, 0.1);
        }
    }
}

const traffic = [
    new Vehicle(road.center(1), -100, 30, 50, 3),
    new Vehicle(road.center(0), -300, 30, 50, 3),
    new Vehicle(road.center(2), -400, 30, 50, 3),
    new Vehicle(road.center(1), -500, 30, 50, 3),
    new Vehicle(road.center(0), -700, 30, 50, 3),
    new Vehicle(road.center(0), -900, 30, 50, 3),
    new Vehicle(road.center(1), -1000, 30, 50, 3),
    new Vehicle(road.center(0), -1000, 30, 50, 3),
    new Vehicle(road.center(1), -1200, 30, 50, 3),
];

function generate_vehicle(num) {
    const vehicles = [];
    for (let i = 0; i < num; i++) {
        vehicles.push(
            new Vehicle(road.center(1), 100, 30, 50, 4, false)
        );
    }
    return vehicles;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < vehicles.length; i++){
        vehicles[i].update(road.borders, traffic);
    }

    best = vehicles.find(
        event => event.y === Math.min(
            ...vehicles.map((event) => event.y)
    ));

    canvas.height = window.innerHeight;
    // networkCanvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -best.y + canvas.height * 0.7);

    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx);
    }
    
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < vehicles.length; i++) {
        vehicles[i].draw(ctx);
    }

    ctx.globalAlpha = 1;
    best.draw(ctx, true);
    ctx.restore();

    // networkCtx.lineDashOffset = -time / 50;
    // Visualizer.drawNetwork(networkCtx, best.network);
    requestAnimationFrame(animate);
}

function save() {
    localStorage.setItem("best", JSON.stringify(best.network));
}

function discard() {
    localStorage.removeItem("best");
}

animate();
