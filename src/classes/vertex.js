/* A vertex of a undirected graph. A wrapper class for a Node instance.
The value of Weighted Quick Union data structure used by Kruscal's. */

export class Vertex {
    constructor(node) {
        this.node = node;
        this.parent = this;
        this.size = 1;
    }
}