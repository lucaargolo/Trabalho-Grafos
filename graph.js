const verticeSize = 30

class Vertice {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = 0
    }

    isColliding(vertice) {
        let distSq = (this.x - vertice.x) * (this.x - vertice.x) + (this.y - vertice.y) * (this.y - vertice.y);
        let radSumSq = verticeSize * verticeSize;
        return (distSq !== radSumSq && distSq <= radSumSq)
    }

    isPointInside(x, y) {
        return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) <= (verticeSize/2)*(verticeSize/2)
    }
}

class Edge {
    constructor(vertice1, vertice2, directed) {
        this.vertice1 = vertice1
        this.vertice2 = vertice2
        this.directed = directed
    }

    isEqual(edge) {
        return (this.vertice1 === edge.vertice1 && this.vertice2 === edge.vertice2) || (this.vertice2 === edge.vertice1 && this.vertice1 === edge.vertice2)
    }
}

class Graph {
    constructor(onUpdate) {
        this.vertices = []
        this.edges = []
        this.onUpdate = onUpdate
    }

    getVertice(x, y) {
        let vertice = null
        this.vertices.forEach((v) => {
            if(v.isPointInside(x, y)) {
                vertice = v
                this.onUpdate()
            }
        })
        return vertice
    }

    addVertice(vertice) {
        let colliding = this.isVerticeColliding(vertice)
        if(!colliding) {
            this.vertices.push(vertice)
            this.onUpdate()
        }
        return !colliding
    }

    removeVertice(vertice) {
        const index = this.vertices.indexOf(vertice);
        if (index > -1) {
            this.vertices.splice(index, 1);
            let edgesToRemove = []
            this.edges.forEach((e) => {
                if(vertice === e.vertice1 || vertice === e.vertice2) {
                    edgesToRemove.push(e)
                }
            })
            edgesToRemove.forEach((e) => {
                this.removeEdge(e)
            })
        }
    }

    isVerticeColliding(vertice) {
        let colliding = false
        this.vertices.forEach((v) => {
            if(v !== vertice && v.isColliding(vertice)) {
                colliding = true
            }
        })
        return colliding
    }

    getEdge(vertice1, vertice2) {
        let edge = null
        let equalEdge = new Edge(vertice1, vertice2)
        this.edges.forEach((e) => {
            if(e.isEqual(equalEdge)) {
                edge = e
            }
        })
        return edge
    }

    addEdge(edge) {
        let colliding = false
        this.edges.forEach((e) => {
            if(e.isEqual(edge)) {
                colliding = true
            }
        })
        if(!colliding) {
            this.edges.push(edge)
            this.onUpdate()
        }
        return !colliding
    }

    removeEdge(edge) {
        const index = this.edges.indexOf(edge);
        if (index > -1) {
            this.edges.splice(index, 1);
        }
    }
}