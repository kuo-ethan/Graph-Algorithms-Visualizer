import { Vertex } from '../classes/vertex';
import { getCompleteGraphEdges } from './prims'

/* Kruskal's algorithm, using Weighted Quick Union data structure with path compression. 
Returns a list of edges in the MST, in order of visitation.
*/
export function kruskals(grid) {
    const edgesInOrder = []; // for animation purposes
    const nodes = getAllNodesKruskals(grid); // nodes that are vertices
    const edges = getCompleteGraphEdges(nodes, grid); // note: there are 2 directed edges for each undirected edge
    const vertices = wrapNodesInVertices(nodes); // nodes wrapped in a Vertex instance, enabling Union Find functionalities
    const sortedEdgesAscending = sortEdges(edges); // pick a random directed edge for each undirected edge
    for (const curr_edge of sortedEdgesAscending) {
        const u = nodeToVertex(curr_edge.start, vertices);
        const v = nodeToVertex(curr_edge.end, vertices);
        if (!sameSet(u, v)) {
            edgesInOrder.push(curr_edge);
            union(u, v);
        }
    }
    return edgesInOrder;
}

/* Sort all undirected edges in the graph by ascending weight. 
Assumes that edges has "forward" and "backward" directed edges side-by-side. */
function sortEdges(edges) {
    const directed_edges = [];
    for (let i = 0; i < edges.length; i += 2) {
        const forward = edges[i];
        const backward = edges[i + 1];
        // choose a random direction for each edge animation
        const randomVal = Math.random();
        if (randomVal < 0.5) {
            directed_edges.push(forward);
        } else {
            directed_edges.push(backward);
        }
    }
    function edgeComparator(e1, e2) {
        return e1.weight - e2.weight;
    }
    return directed_edges.sort(edgeComparator);
}

function nodeToVertex(node, vertices) {
    for (const vertex of vertices) {
        if (vertex.node === node) {
            return vertex;
        }
    }
}

function getAllNodesKruskals(grid) {
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

function wrapNodesInVertices(nodes) {
    const vertices = [];
    for (const node of nodes) {
        vertices.push(new Vertex(node));
    }
    return vertices;
}


/* UNION FIND DATA STRUCTURE
=====================================================================================
*/
/* Find the representative for V, and set the parent of V and all predecessors
to that representative. */
function find(v) {
    if (v.parent === v) {
        return v;
    }
    v.parent = find(v.parent);
    return v.parent;
}

/* Return true if U and V are in the same set. */
function sameSet(u, v) {
    return find(u) === find(v);
}

/* Union U and V into a single set. Union is WEIGHTED, so make the root of the tree 
with more nodes the representative of the tree with fewer nodes. */
function union(u, v) {
    if (sameSet(u, v)) {
        return find(u);
    } else {
        const rootU = find(u);
        const rootV = find(v);
        if (rootU.size > rootV.size) {
            rootV.parent = rootU;
            rootU.size += rootV.size;
        } else {
            rootU.parent = rootV;
            rootV.size += rootU.size;
        }
    }
}
