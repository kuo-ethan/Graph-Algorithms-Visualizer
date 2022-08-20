import {PriorityQueue} from './priority_queue';

/* My CS61B version of Dijkstra's that uses a priority queue. 
Returns a list of nodes in order of visitation. */
export function my_dijkstras(grid, startNode, finishNode) {
  const visitedNodesInOrder = []; // for animation purposes
  const unvisitedNodes = getAllNodes(grid); // dist and prev are initially Infinity and null
  startNode.distance = 0;
  // Set up the priority queue
  const PQ = new PriorityQueue();
  for (const node of unvisitedNodes) {
    PQ.insert(node);
  }
  // Begin Dijkstra's algorithm
  while (!PQ.is_empty()) {
    const next_up = PQ.pop();
    next_up.isVisited = true;
    visitedNodesInOrder.push(next_up);
    // Return if reached goal
    if (next_up === finishNode) {
      return visitedNodesInOrder;
    }
    // Relax edges
    const unvisitedNeighbors = getUnvisitedNeighbors(next_up, grid);
    for (const neighbor of unvisitedNeighbors) {
      const dist = next_up.distance + 1; // NOTE: if weighted, change 1 to 2
      if (dist < neighbor.distance) {
        neighbor.distance = dist;
        neighbor.previousNode = next_up;
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
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
