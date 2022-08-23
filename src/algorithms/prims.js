import { dijkstras, getNodesInShortestPathOrder } from './dijkstra';
import { Edge } from '../classes/edge';
import { PriorityQueue } from '../classes/priority_queue';
import { createNode } from '../Visualizer/Visualizer.jsx'

export function prims(grid) {
  const edgesInOrder = []; // for animation purposes
  const vertices = getAllNodesPrims(grid);
  const edges = getCompleteGraphEdges(vertices, grid); // assume complete graph

  // Set up the priority queue
  const PQ = new PriorityQueue();
  for (const vertex of vertices) {
    if (vertex.isStart) {
      vertex.distance = 0;
    }
    vertex.priority = vertex.distance;
    PQ.insert(vertex);
  }

  // Begin algorithm
  while (!PQ.is_empty()) {
    const curr = PQ.pop();
    if (!curr.isStart) { // Adding edge to the MST
      const edgeTraversed = getEdge(curr.previous, curr, edges);
      edgeTraversed.traversed = true;
      edgesInOrder.push(edgeTraversed);
    }
    // Relax edges
    const untraversedEdges = getUntraversedEdges(curr, edges);
    for (const edge of untraversedEdges) {
      const neighbor = edge.end;
      if (edge.weight < neighbor.distance) {
        neighbor.distance = edge.weight;
        neighbor.priority = edge.weight;
        neighbor.previous = curr;
        PQ.refresh(neighbor);
      }
    }
  }
  return edgesInOrder;
}

/* Get all vertices in the grid. */
function getAllNodesPrims(grid) {
  const vertices = [];
  for (const row of grid) {
    for (const node of row) {
      if (node.isVertex || node.isStart) {
        vertices.push(node);
      }
    }
  }
  return vertices;
}

/* Manually construct the unique directed edges for a complete graph with these vertices. */
export function getCompleteGraphEdges(vertices, grid){
  const edges = [];
  for (let i = 0; i < vertices.length - 1; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
        const start = vertices[i];
        const end = vertices[j];
        const shortestPath = [];

        const tempGrid = getTempGrid(start.row, start.col, end.row, end.col);
        const temp_source = tempGrid[start.row][start.col];
        const temp_dest = tempGrid[end.row][end.col];
        // Get the shortest path from START to END using A*
        dijkstras(tempGrid, temp_source, temp_dest, 'manhattan');
        const tempShortestPath = getNodesInShortestPathOrder(temp_dest);
        for (const temp_node of tempShortestPath) {
          shortestPath.push(grid[temp_node.row][temp_node.col]);
        }
        const forward = new Edge(start, end, shortestPath);
        const backward = new Edge(end, start, shortestPath.slice().reverse());
        edges.push(forward);
        edges.push(backward);
    }
  }
  return edges;
}

/* Return the untraversed edges going from SOURCE. */
function getUntraversedEdges(source, edges) {
  const untraversedEdges = [];
  for (const edge of edges) {
    if (edge.start === source && !edge.traversed) {
      untraversedEdges.push(edge);
    }
  }
  return untraversedEdges;
}

/* Return the edge that goes from vertex START to END. */
function getEdge(start, end, edges) {
  for (const edge of edges) {
    if (edge.start === start && edge.end === end) {
      return edge;
    }
  }
  return null;
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