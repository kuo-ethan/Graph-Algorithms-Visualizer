/* A directed edge between two vertices. 
Used only for spanning algorithms (Prim's and Kruscal's). */

export class Edge {
    constructor(start, end, path) {
        this.start = start;
        this.end = end;
        this.path = path;
        this.weight = path.length + 1;
        this.traversed = false;
    }
}