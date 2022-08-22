import {PriorityQueue} from './priority_queue';

/* Dijkstra's algorithm as taught in CS 61B. Uses a priority queue.
Pass in a heuristic function to run A* algorithm. 
Returns a list of nodes in order of visitation. */
export function dijkstras(grid, startNode, finishNode, heuristic='') {
  const visitedNodesInOrder = []; // for animation purposes
  const unvisitedNodes = getAllNodes(grid); // DISTANCE and PREVIOUS should be initially Infinity and null
  startNode.distance = 0;
  // Set up the priority queue
  const PQ = new PriorityQueue();
  for (const node of unvisitedNodes) {
    node.priority = node.distance; // Regardless of Dijkstra's or A*, initial priorities are all Infinity
    PQ.insert(node);
  }
  // Begin algorithm
  while (!PQ.is_empty()) {
    const next_up = PQ.pop();
    if (next_up.isWall) {
      continue;
    }
    // Closest node has infinite distance => trapped
    if (next_up.distance === Infinity) {
      return visitedNodesInOrder;
    }
    next_up.isVisited = true;
    // Return if reached goal
    if (next_up === finishNode) {
      return visitedNodesInOrder;
    }
    // Don't include start node in animation
    if (next_up !== startNode) {
      visitedNodesInOrder.push(next_up);
    }
    // Relax edges
    const unvisitedNeighbors = getUnvisitedNeighbors(next_up, grid);
    for (const neighbor of unvisitedNeighbors) {
      var dist = next_up.distance + 1;
      if (next_up.isWeighted) {
        dist += 1;
      } else if (neighbor.isWeighted) {
        dist += 1;
      }
      if (dist < neighbor.distance) {
        neighbor.distance = dist;
        neighbor.previous = next_up;
        if (!heuristic) { // For Dijkstras
          neighbor.priority = dist;
        } else { // For A*
          neighbor.priority = dist + HEURISTICS[heuristic](neighbor, finishNode);
        }
        PQ.refresh(neighbor);
      }
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previous;
  }
  // Exclude start and finish for animation purposes
  return nodesInShortestPathOrder.slice(1, -1);
}

/* Define heuristic functions and disctionary for A*
========================================================
NOTE: Heuristic is scaled to weigh more heavy than actual distance from source.
This is to ensure that if two nodes have the same priority, we choose the node
closer to the goal. This does not really violate admissibility since nodes that are
0.001 off are essentially still the same priority; we just use the tiny difference
to specify an ordering of equal priority nodes.
*/

/* Euclidean heuristic guesses distance with a "birds-eye-view". */
function euclidean(node, goal) {
  return 1.001 * (Math.sqrt(Math.pow(node.row - goal.row, 2) + Math.pow(node.col - goal.col, 2)));
}

/* Manhattan heuristic guesses distance using the 4 cardinal directions. */
function manhattan(node, goal) {
  return 1.001 * (Math.abs(node.row - goal.row) + Math.abs(node.col - goal.col));
}

/* HEURISTICS is a dictionary mapping heuristic name to heuristic function. */
const HEURISTICS = {};
HEURISTICS['euclidean'] = euclidean;
HEURISTICS['manhattan'] = manhattan;