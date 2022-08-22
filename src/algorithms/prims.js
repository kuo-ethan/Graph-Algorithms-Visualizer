import { dijkstras } from './dijkstra';
import { Edge } from './edge';
import { PriorityQueue } from './priority_queue';

export function prims(grid, startNode) {
  const edgesInOrder = []; // for animation purposes
  const vertices = getAllVertices(grid); // distance and prev are already Infinity and null, respectively
  const edges = []
  // Manually construct the edges for a complete graph with these vertices.
  for (const i = 0; i < vertices.length - 1; i++) {
    for (const j = i + 1; j < vertices.length; j++) {
        const source = vertices[i];
        const dest = vertices[j];
        const temp_grid = getHypotheticalGrid(source, dest);
        // Get the shortest path from SOURCE to DEST using A*
        dijkstras(___, source, dest, 'manhattan');
        const e = new Edge(source, dest, ______);
        edges.push(e);
    }
  }

  startNode.distance = 0; // here, distance represents the closest distance to the MST so far
  // Set up the priority queue
  const PQ = new PriorityQueue();
  for (const node of unvisitedVertex) {
    node.priority = node.distance; 
    PQ.insert(node);
  }
  // Begin algorithm
  while (!PQ.is_empty()) {
    const next_up = PQ.pop();
    next_up.isVisited = true;
    // Relax edges
    const unvisitedNeighbors = getUnvisitedNeighbors(next_up, grid);
    for (const neighbor of unvisitedNeighbors) {
      var dist;
      const isWeightedEdge = next_up.isWeighted || neighbor.isWeighted; // A weighted edge is incident to a weighted node
      if (isWeightedEdge) {
        dist = next_up.distance + 2;
      } else {
        dist = next_up.distance + 1;
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
  return edgesInOrder
}

function getAllVertices(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
        if (node.isVertex) {
            nodes.push(node);
        }
        }
    }
    return nodes;
}

function getUntraversedEdges(source, vertices) {

}

/* Returns a empty grid with SOURCE and DEST as start and finish. */
function getHypotheticalGrid(source, dest) {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      const node = createNode(col, row);
      currentRow.push(node);
    }
    grid.push(currentRow);
  }
  return grid;
}