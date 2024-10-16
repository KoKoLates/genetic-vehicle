# Genetic Vehicle 
`genetic algorithm` 、 `neural network control`

## Overview

## Event Listener
Here are define several keyboard event listener.
* `s`: save current best weights to local storage
* `d`: remove current local storage
* `f`: reload the window (next generation)

## Hyper-Parameters
`index.js`

other define the obstacles arragement. 
```js
const others = [
  { x: 0, y: 50 }, { x: 2, y: 20 }, { x: 1, y: -110 }
];
```

you can modify the network architecture, but note that the input layer of network should be the same as sensors number
