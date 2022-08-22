import { dijkstras, getNodesInShortestPathOrder } from './dijkstra';
import { Edge } from './edge';
import { PriorityQueue } from './priority_queue';

export function prims(grid) {
  const edgesInOrder = []; // for animation purposes
  const vertices = getAllVertices(grid);

  // Manually construct the unique edges for a complete graph with these vertices.
  const edges = [];
  for (const i = 0; i < vertices.length - 1; i++) {
    for (const j = i + 1; j < vertices.length; j++) {
        const source = vertices[j];
        const dest = vertices[j];
        const shortestPath = [];

        const tempGrid = getTempGrid(source.row, source.col, dest.row, dest.col);
        const temp_source = tempGrid[source.row][source.col];
        const temp_dest = tempGrid[dest.row][dest.col];
        // Get the shortest path from SOURCE to DEST using A*
        dijkstras(tempGrid, temp_source, temp_dest, 'manhattan');
        const tempShortestPath = getNodesInShortestPathOrder(temp_dest);
        for (const temp_node in tempShortestPath) {
          shortestPath.push(grid[temp_node.row][temp_node.col]);
        }
        const e = new Edge(source, dest, shortestPath);
        edges.push(e);
    }
  }

  startVertex.distance = 0; // here, distance represents the closest distance to the MST so far
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
        if (node.isVertex || node.isStart) {
            nodes.push(node);
        }
        }
    }
    return nodes;
}

function getUntraversedEdges(source, vertices) {

}

/* Returns a empty grid with the given start and finish. */
function getTempGrid(source_row, source_col, dest_row, dest_col) {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      const node = createNode(col, row);
      if (source_row === row && source_col === col) {
        node.isStart = true;
      } else if (dest_row === row && dest_col === col) {
        node.isFinish = true;
      }
      currentRow.push(node);
    }
    grid.push(currentRow);
  }
  return grid;
}