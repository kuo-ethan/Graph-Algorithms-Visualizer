import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstras, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {prims} from '../algorithms/prims';
import './PathfindingVisualizer.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const SLOW = 45;
const NORMAL = 15;
const FAST = 5;

var algorithm = '';
var speed = NORMAL;
var toggle_weights = false;

// Add weights instead of walls when left shift is pressed.
// refactor (resolved: don't think it really matters what toggle_weights is, just never use it)
document.addEventListener("keydown", function(event) {
  if (event.code === 'ShiftLeft') {
      toggle_weights = true;
  }
});

// refactor (resolved: see above)
document.addEventListener("keyup", function(event) {
  if (event.code === 'ShiftLeft') {
      toggle_weights = false;
  }
});

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  selectDijkstras() {
    algorithm = "Dijkstra's";
  }

  selectAStarEuclidean() {
    algorithm = "A* (Euclidean Heuristic)";
  }

  selectAStarManhattan() {
    algorithm = "A* (Manhattan Heuristic)";
  }

  selectPrims() {
    algorithm = "Prim's"
  }

  componentDidMount() {
    const grid = initializeGrid();
    this.setState({grid});
  }

  // refactor - if MST algorithm, mouse down means we are plotting vertices to span. (resolved)
  handleMouseDown(row, col) {
    const node = this.state.grid[row][col];
    if (algorithm === "Prim's" || algorithm === "Kruscal's") {
      const newGrid = getNewGridWithVertexToggled(this.state.grid. row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    } else {
      if (toggle_weights && !node.isWall) {
        const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
      } else if (!toggle_weights && !node.isWeighted) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
      }
    }
  }

  // refactor (resolved)
  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) {
      return;
    }
    const node = this.state.grid[row][col];
    if (algorithm === "Prim's" || algorithm === "Kruscal's") {
      const newGrid = getNewGridWithVertexToggled(this.state.grid. row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    } else {
      if (toggle_weights && !node.isWall) {
        const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
      } else if (!toggle_weights && !node.isWeighted) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
      }
    }
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  /* Reset both the grid UI and node objects */
  clear() {
    const grid = initializeGrid();
    this.setState({grid});
    this.clearGridUI();
  }

  /* Uncolors all nodes except the start and finish. Mods (walls, weights, vertices) may be kept. */
  // refactor (also keep node-to-span) (resolved)
  clearGridUI(keep_mods=false) {
    for (const row of this.state.grid) {
      for (const node of row) {
        if (algorithm == "Prim's") {
          if (node.isStart) {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
          } else if (node.isVertex && keep_mods) {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-vertex';
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node';
          }
        } else {
          if (node.isStart) {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
          } else if (node.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
          } else if (node.isWall && keep_mods) {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
          } else if (node.isWeighted && keep_mods) {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-weighted';
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node';
          }
        }
      }
    }
  }

  /* Reset both the grid UI and node objects, except walls and weighted nodes are kept. */
  // refactor (also keep node-to-span) (resolved)
  reset() {
    const grid = resetGrid(this.state.grid);
    this.setState({grid});
    this.clearGridUI(true); // Keep walls + weight nodes or vertices in UI
  }

  selectSlowSpeed() {
    speed = SLOW;
  }

  selectNormalSpeed() {
    speed = NORMAL;
  }

  selectFastSpeed() {
    speed = FAST;
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.isWeighted) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-weighted-and-visited';
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
        }
      }, speed * i);
    }
  }

  animatePrims(edgesInOrder) {
    // Pass in the (a, b) node pairs that represent edges drawn in MST.
    // Call Dijkstras to draw these edges (start = a, finish = b)
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (node.isWeighted) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-weighted-and-path';
        } else {   
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
        }
      }, 50 * i);
    }
  }

  visualize() {
    switch(algorithm) {
      case "Dijkstra's":
        this.visualizeDijkstra();
        break;
      case "A* (Euclidean Heuristic)":
        this.visualizeAStar("euclidean");
        break;
      case "A* (Manhattan Heuristic)":
        this.visualizeAStar("manhattan");
        break;
      case "Prim's":
        this.visualizePrims();
        break;
      default:
    }
  }

  visualizeDijkstra() {
    // Before running and animating dijkstra's, reset nodes and UI.
    this.reset();
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstras(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAStar(heuristic) {
    this.reset();
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstras(grid, startNode, finishNode, heuristic);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizePrims() {
    this.reset();
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const edgesInOrder = prims(grid, startNode);
    this.animatePrims(edgesInOrder);
  }

  render() {
    const {grid, mouseIsPressed} = this.state;
    return (
      <>
        <Navbar bg="light" expand="lg">
          <Container>
            <Button variant='light'>Info</Button>{' '}
            <Button variant='light' onClick={() => this.clear()}>Clear</Button>{' '}
            <Button variant='light' onClick={() => this.visualize()}>Visualize</Button>{' '}
            <NavDropdown title='Algorithms'>
                <NavDropdown.Item onClick={() => this.selectDijkstras()}>Dijkstra's</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.selectAStarEuclidean()}>A* (Euclidean Heuristic)</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.selectAStarManhattan()}>A* (Manhattan Heuristic)</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.selectPrims()}>Prim's</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title='Speed'>
                <NavDropdown.Item onClick={() => this.selectSlowSpeed()}>Slow</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.selectNormalSpeed()}>Normal</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.selectFastSpeed()}>Fast</NavDropdown.Item>
            </NavDropdown>
          </Container>
        </Navbar>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall, isWeighted} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isWeighted={isWeighted}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

/* Return a grid representing the initial grid with only start and finish. */
const initializeGrid = () => {
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
};

/* Return the initial grid but with walls and weighted nodes kept. */
// refactor (also keep node-to-span) (resolved: keeping vertices)
const resetGrid = (old_grid) => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    const old_row = old_grid[row];
    for (let col = 0; col < 50; col++) {
      const node = createNode(col, row);
      if (algorithm == "Prim's") {
        node.isVertex = old_row[col].isVertex;
      } else {
        node.isWall = old_row[col].isWall;
        node.isWeighted = old_row[col].isWeighted;
      }
      currentRow.push(node);
    }
    grid.push(currentRow);
  }
  return grid;
};

// refactor (may not need isStart/isFinish for spanning algorithms) (resolved: again, prob just can ignore the isFinish attribute)
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    isWeighted: false,
    isVertex: false, // used only for spanning algorithms
    previous: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithWeightToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWeighted: !node.isWeighted,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithVertexToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isVertex: !node.isVertex,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};