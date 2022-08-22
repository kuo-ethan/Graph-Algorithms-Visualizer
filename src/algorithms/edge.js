/* An EDGE represents a directed edge between two vertices. 
Used only for spanning algorithms (Prim's and Kruscal's). */

export class Edge {
    constructor(source, dest, path) {
        this.source = source;
        this.dest = dest;
        this.path = path;
        this.weight = path.length - 1;
    }

    // ESSENTIAL METHODS

}