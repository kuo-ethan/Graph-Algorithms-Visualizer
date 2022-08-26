import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstras, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { prims } from "../algorithms/prims";
import { kruskals } from "../algorithms/kruskals";
import "./Visualizer.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import start from "./pictures/start.png";
import end from "./pictures/end.png";
import path from "./pictures/path.png";
import visited from "./pictures/visited.png";
import wall from "./pictures/wall.png";
import weight from "./pictures/weight.png";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const EXTRA_SLOW = 200;
const SLOW = 45;
const NORMAL = 15;
const FAST = 5;

var algorithm = "Dijkstra's"; // for simplicity, make default algorithm Dijkstra's
var speed = NORMAL;
var toggle_weights = false;
var first_vertex_placed = false;

// Add weights instead of walls when left shift is pressed.
document.addEventListener("keydown", function (event) {
  if (event.code === "ShiftLeft") {
    toggle_weights = true;
  }
});

// refactor (resolved: see above)
document.addEventListener("keyup", function (event) {
  if (event.code === "ShiftLeft") {
    toggle_weights = false;
  }
});

export default class Visualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      show: false,
    };
  }

  selectDijkstras() {
    if (this.switchedModes("pathfinding")) {
      algorithm = "Dijkstra's";
      this.clear();
    }
    algorithm = "Dijkstra's";
  }

  selectAStarEuclidean() {
    if (this.switchedModes("pathfinding")) {
      algorithm = "A* (Euclidean Heuristic)";
      this.clear();
    }
    algorithm = "A* (Euclidean Heuristic)";
  }

  selectAStarManhattan() {
    if (this.switchedModes("pathfinding")) {
      algorithm = "A* (Manhattan Heuristic)";
      this.clear();
    }
    algorithm = "A* (Manhattan Heuristic)";
  }

  selectPrims() {
    if (this.switchedModes("spanning")) {
      algorithm = "Prim's";
      this.clear();
    } else {
      if (!this.startExists()) {
        // then we switched from Kruskals to Prims
        console.log("enabling green vertex");
        first_vertex_placed = false; // enable plotting the green start vertex
      }
      algorithm = "Prim's";
    }
  }

  selectKruskals() {
    if (this.switchedModes("spanning")) {
      algorithm = "Kruskal's";
      this.clear();
    }
    algorithm = "Kruskal's";
  }

  switchedModes(next_mode) {
    var curr_mode;
    if (algorithm === "Prim's" || algorithm === "Kruskal's") {
      curr_mode = "spanning";
    } else {
      curr_mode = "pathfinding";
    }
    return curr_mode !== next_mode;
  }

  componentDidMount() {
    const grid = initializePathfindingGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const node = this.state.grid[row][col];
    if (algorithm === "Prim's") {
      if (!first_vertex_placed) {
        const newGrid = getNewGridWithStartToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
        first_vertex_placed = true;
      } else {
        const newGrid = getNewGridWithVertexToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
      }
    } else if (algorithm === "Kruskal's") {
      const newGrid = getNewGridWithVertexToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    } else {
      if (!node.isStart && !node.isFinish) {
        if (toggle_weights && !node.isWall) {
          const newGrid = getNewGridWithWeightToggled(
            this.state.grid,
            row,
            col
          );
          this.setState({ grid: newGrid, mouseIsPressed: true });
        } else if (!toggle_weights && !node.isWeighted) {
          const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
          this.setState({ grid: newGrid, mouseIsPressed: true });
        }
      }
    }
  }

  // Only for weights and walls, not vertices
  handleMouseEnter(row, col) {
    if (
      !this.state.mouseIsPressed ||
      algorithm === "Prim's" ||
      algorithm === "Kruskal's"
    ) {
      return;
    }
    const node = this.state.grid[row][col];
    if (!node.isStart && !node.isFinish) {
      if (toggle_weights && !node.isWall) {
        const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
      } else if (!toggle_weights && !node.isWeighted) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
      }
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  /* Reset both the grid UI and node objects */
  clear() {
    var grid;
    if (algorithm === "Prim's" || algorithm === "Kruskal's") {
      grid = initializeSpanningGrid();
      first_vertex_placed = false;
    } else {
      grid = initializePathfindingGrid();
    }
    this.setState({ grid });
    this.clearGridUI();
  }

  /* Uncolors all nodes except the start and finish. Mods (walls, weights, vertices) may be kept. */
  // refactor (also keep node-to-span) (resolved)
  clearGridUI(keep_mods = false) {
    for (const row of this.state.grid) {
      for (const node of row) {
        if (algorithm === "Prim's") {
          if (node.isStart && keep_mods) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-start";
          } else if (node.isVertex && keep_mods) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-vertex";
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node";
          }
        } else if (algorithm === "Kruskal's") {
          if (node.isVertex && keep_mods) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-vertex";
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node";
          }
        } else {
          if (node.isStart) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-start";
          } else if (node.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-finish";
          } else if (node.isWall && keep_mods) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-wall";
          } else if (node.isWeighted && keep_mods) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-weighted";
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node";
          }
        }
      }
    }
  }

  /* Reset both the grid UI and node objects to its initial state. 
  Objects (walls + weights + start + finish, start + vertices) are kept. */
  reset() {
    const grid = resetGrid(this.state.grid);
    this.setState({ grid });
    this.clearGridUI(true);
  }

  selectExtraSlowSpeed() {
    speed = EXTRA_SLOW;
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
            "node node-weighted-and-visited";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, speed * i);
    }
  }

  animateMST(edgesInOrder) {
    this.helper(edgesInOrder, 0);
  }

  helper(edgesInOrder, timeElapsed) {
    if (edgesInOrder.length > 0) {
      const curr_edge = edgesInOrder[0];
      setTimeout(() => {
        this.animateShortestPath(curr_edge.path);
      }, timeElapsed);
      timeElapsed = timeElapsed + curr_edge.weight * speed;
      this.helper(edgesInOrder.slice(1), timeElapsed);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    var animationSpeed = SLOW; // for pathfinding algorithms
    var style = "node node-shortest-path";
    if (algorithm === "Prim's" || algorithm === "Kruskal's") {
      animationSpeed = speed;
      style = "node node-visited";
    }
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (node.isWeighted) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-weighted-and-path";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            style;
        }
      }, animationSpeed * i);
    }
  }

  visualize() {
    switch (algorithm) {
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
      case "Kruskal's":
        this.visualizeKruskals();
        break;
      default:
    }
  }

  visualizeDijkstra() {
    // Before running and animating dijkstra's, reset nodes and UI.
    this.reset();
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstras(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAStar(heuristic) {
    this.reset();
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstras(
      grid,
      startNode,
      finishNode,
      heuristic
    );
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizePrims() {
    this.reset();
    const { grid } = this.state;
    const edgesInOrder = prims(grid);
    this.animateMST(edgesInOrder);
  }

  visualizeKruskals() {
    this.reset();
    const { grid } = this.state;
    const edgesInOrder = kruskals(grid);
    this.animateMST(edgesInOrder);
  }

  startExists() {
    const { grid } = this.state;
    for (const row of grid) {
      for (const node of row) {
        if (node.isStart) {
          return true;
        }
      }
    }
    return false;
  }

  handleModal() {
    this.setState({ show: !this.state.show });
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <Navbar bg="light" expand="lg">
          <Container>
            <Button variant="light" onClick={() => this.handleModal()}>
              Info
            </Button>{" "}
            <Modal
              show={this.state.show}
              onHide={() => this.handleModal()}
              dialogClassName="custom-dialog"
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body className="show-grid">
                <Container>
                  <Row>
                    <Col>
                      <div>
                        <h2>Getting Started</h2>
                        <br></br>
                        <ol>
                          <li>
                            Select a graph algorithm from the <strong>Algorithms</strong> dropdown.
                          </li>
                          <li>
                            For pathfinding algorithms, click and drag to add
                            walls. Hold <strong>left shift</strong> and click to add weights.
                            Click on walls or weights to remove them.
                          </li>
                          <li>
                            For spanning algorithms, click to add vertices. Note
                            for Prim's, the first vertex placed will be the start vertex.
                          </li>
                          <li>
                            Choose an animation speed from the <strong>Speed</strong> dropdown.
                          </li>
                          <li>
                            Click <strong>Visualize</strong> to run the algorithm on your graph.
                            You may revisualize the algorithm by clicking <strong>Visualize</strong> again.
                          </li>
                          <li>
                            Click <strong>Clear</strong> to remove all walls, weights, and
                            vertices.
                          </li>
                        </ol>
                      </div>
                    </Col>
                    <Col xs={9}>
                      <div>
                        <h2>Know Your Algorithms</h2>
                        <br></br>
                        <h4>Pathfinding</h4>
                        <i>Note:</i> Walls are impassable. Adjacent nodes have an edge weight of 1. Weights add 1 to all edges incident to the weighted node. For example, passing through a weighted node adds 2 to the distance.
                        <ul>
                          <li>
                            <strong>Dijkstra's:</strong> Finds the shortest path
                            from the start node to every other node in the
                            graph. Visits nodes in order of weighted distance
                            from the start node. Halts when goal node is visited.
                          </li>
                          <li>
                            <strong>A* (Euclidean Heuristic):</strong> A
                            variation of Dijkstra's algorithm. Finds the
                            shortest path from the start node to a particular
                            goal node. Visitation order favors nodes with a
                            shorter Euclidean (straight line) distance from the
                            goal.
                          </li>
                          <li>
                            <strong>A* (Manhattan Heuristic):</strong> A
                            variation of Dijkstra's algorithm. Finds the
                            shortest path from the start node to a particular
                            goal node. Visitation order favors nodes with a
                            shorter quad-directional (up-down-left-right) distance from the
                            goal. The strongest pathfinding algorithm in this
                            visualizer.
                          </li>
                        </ul>
                        <h4>Spanning</h4>
                        <i>Note:</i> The visualizer assumes the graph is <strong>complete</strong>, meaning there is an edge between every possible pair of vertices. Furthermore, the weight of each edge is equal to the quad-directional distance between its two vertices.
                        <ul>
                          <li>
                            <strong>Prim's:</strong> Finds a minimum spanning
                            tree (lightest possible subset of edges that connects all 
                            vertices of a graph) by starting from
                            a given start node, and successively connecting the
                            closest vertex to the already-connected vertices.
                          </li>
                          <li>
                            <strong>Kruskal's:</strong> Finds a minimum spanning
                            tree by repeatedly selecting the lightest edge to be
                            part of the tree, given that the edge does not
                            introduce a cycle in the set of edges selected
                            before.
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <br></br>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <img src={start} alt="start" height="30" width="30" />
                      &nbsp;Start
                    </Col>
                    <Col className="d-flex justify-content-center">
                      <img src={wall} alt="wall" height="30" width="30" />
                      &nbsp;Wall/Vertex
                    </Col>
                    <Col className="d-flex justify-content-center">
                      <img src={visited} alt="visited" height="30" width="30" />
                      &nbsp;Visited/Edge
                    </Col>
                  </Row>
                  <br></br>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <img src={end} alt="end" height="30" width="30" />
                      &nbsp;End
                    </Col>
                    <Col className="d-flex justify-content-center">
                      <img src={weight} alt="weight" height="30" width="30" />
                      &nbsp;Weight
                    </Col>
                    <Col className="d-flex justify-content-center">
                      <img src={path} alt="path" height="30" width="30" />
                      &nbsp;Shortest Path
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
            </Modal>
            <Button variant="light" onClick={() => this.clear()}>
              Clear
            </Button>{" "}
            <Button variant="light" onClick={() => this.visualize()}>
              Visualize
            </Button>{" "}
            <NavDropdown title="Algorithms">
              <NavDropdown.Item onClick={() => this.selectDijkstras()}>
                Dijkstra's
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.selectAStarEuclidean()}>
                A* (Euclidean Heuristic)
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.selectAStarManhattan()}>
                A* (Manhattan Heuristic)
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.selectPrims()}>
                Prim's
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.selectKruskals()}>
                Kruskal's
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Speed">
              <NavDropdown.Item onClick={() => this.selectExtraSlowSpeed()}>
                Extra Slow
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.selectSlowSpeed()}>
                Slow
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.selectNormalSpeed()}>
                Normal
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.selectFastSpeed()}>
                Fast
              </NavDropdown.Item>
            </NavDropdown>
          </Container>
        </Navbar>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {
                    row,
                    col,
                    isFinish,
                    isStart,
                    isWall,
                    isWeighted,
                    isVertex,
                  } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isWeighted={isWeighted}
                      isVertex={isVertex}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
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

/* Return a grid representing the initial grid with only default start and finish. */
const initializePathfindingGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      const node = createNode(col, row);
      node.isStart = row === START_NODE_ROW && col === START_NODE_COL;
      node.isFinish = row === FINISH_NODE_ROW && col === FINISH_NODE_COL;
      currentRow.push(node);
    }
    grid.push(currentRow);
  }
  return grid;
};

/* Return an empty grid. */
const initializeSpanningGrid = () => {
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

/* Return a fresh grid with mods transferred over. */
const resetGrid = (old_grid) => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    const old_row = old_grid[row];
    for (let col = 0; col < 50; col++) {
      const node = createNode(col, row);
      if (algorithm === "Prim's") {
        node.isVertex = old_row[col].isVertex;
        node.isStart = old_row[col].isStart; // For Prim's, start is the first vertex placed
      } else if (algorithm === "Kruskal's") {
        node.isVertex = old_row[col].isVertex;
        node.isStart = false;
      } else {
        node.isStart = row === START_NODE_ROW && col === START_NODE_COL;
        node.isFinish = row === FINISH_NODE_ROW && col === FINISH_NODE_COL;
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
export const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: false,
    isFinish: false,
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

const getNewGridWithStartToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: !node.isStart,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
