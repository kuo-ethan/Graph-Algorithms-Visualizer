/* An EDGE represents a directed edge between two vertices. 
Used only for spanning algorithms (Prim's and Kruscal's). */

export class Edge {
    constructor(source, dest, directed_path) {
        this.source = source;
        this.dest = dest;
        this.directed_path = directed_path;
        this.weight = directed_path.length - 1;
    }

    // ESSENTIAL METHODS

}