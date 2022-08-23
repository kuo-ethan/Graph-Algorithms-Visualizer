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

    info() {
        console.log(`Edge goes from (${this.start.row}, ${this.start.col}) to (${this.end.row}, ${this.end.col}) and its weight is ${this.weight}`)
    }
}