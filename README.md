This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
# Graph Algorithms Visualizer
This application visualizes graph algorithms that solve the problems of pathfinding (finding the shortest path between two nodes) and spanning (finding the cheapest network of edges that connects vertices together). The visualizer is interactive and enables users to create their own graphs and run various algorithms on them. The visualizer features Dijkstra's, A* (with Euclidean and Manhattan heuristics), Prim's, and Kruscal's algorithm. 

This project was forked from Clément Mihailescu's pathfinding visualizer tutorial (https://github.com/clementmihailescu/Pathfinding-Visualizer-Tutorial) and heavily expanded on to include fresher animations, efficient data structures, and new algorithms.

# Relevant Files
The following files can be found in the `src` directory.
- `classes/priority_queue.js`: Javascript file containing class definition for a Priority Queue. Implemented as a min-heap and using dynamic arrays. Used by all pathfinding algorithms and Prim's algorithm.
- `algorithms`: Javascript files containing logic for Dijkstra's, A*, Prim's, and Kruscal's algorithms. `algorithms/kruscals.js` also contains logic for a Weighted Quick Union data structure with path compression.
- `Visualizer/Visualizer.jsx`: Javascript file for the Graph Algorithms Visualizer.
- `Visualizer/Node/Node.css`: CSS file containing most styles and animations used in the visualizer.

# Usage

1. Click the green "Code" button and clone the repository onto your local computer.
2. In the project directory, you can run:

### `npm start`

If this fails, please run...

### `npm install react-scripts`

...and try again.

Thank you for visiting my graph algorithms visualizer!
