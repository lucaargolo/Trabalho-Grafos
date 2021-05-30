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
        this.selectedVertice = null
        this.startVertice = null
        this.endVertice = null
        this.vertices = []
        this.edges = []
        this.onUpdate = onUpdate
    }

    clear() {
        this.selectedVertice = null
        this.startVertice = null
        this.endVertice = null
        this.vertices = []
        this.edges = []
        this.onUpdate()
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

function encodeGraph(graph) {
    let encodedGraph = ""
    encodedGraph += graph.vertices.length + ";"
    graph.vertices.forEach((v) => {
        encodedGraph += v.x + ";" + v.y + ";" + v.value + ";"
    })
    encodedGraph += graph.edges.length + ";"
    graph.edges.forEach((e) => {
        encodedGraph += graph.vertices.indexOf(e.vertice1) + ";" + graph.vertices.indexOf(e.vertice2) + ";" + (e.directed ? 1 : 0) + ";"
    })
    encodedGraph += graph.vertices.indexOf(graph.startVertice) + ";"
    encodedGraph += graph.vertices.indexOf(graph.endVertice)
    return btoa(encodedGraph)
}

function decodeGraph(base64, onUpdate) {
    let decodedGraph = new Graph(onUpdate)
    let encodedGraph = atob(base64).split(";")
    let verticesLength = encodedGraph[0]
    for(let x = 0; x < verticesLength; x++) {
        let vertice = new Vertice(encodedGraph[(x*3)+1], encodedGraph[(x*3)+2])
        vertice.value = encodedGraph[(x*3)+3]
        decodedGraph.vertices.push(vertice)
    }
    let edgesLength = encodedGraph[(verticesLength*3)+1]
    for(let x = 0; x < edgesLength; x++) {
        let v1 = decodedGraph.vertices[encodedGraph[(verticesLength*3)+1+(x*3)+1]]
        let v2 = decodedGraph.vertices[encodedGraph[(verticesLength*3)+1+(x*3)+2]]
        let d = encodedGraph[(verticesLength*3)+1+(x*3)+3] === "1"
        let edge = new Edge(v1, v2, d)
        decodedGraph.edges.push(edge)
    }
    let start = encodedGraph[(verticesLength*3)+1+(edgesLength*3)+1]
    if(start >= 0) {
        decodedGraph.startVertice = decodedGraph.vertices[start]
    }
    let end = encodedGraph[(verticesLength*3)+1+(edgesLength*3)+2]
    if(end >= 0) {
        decodedGraph.endVertice = decodedGraph.vertices[end]
    }
    decodedGraph.onUpdate = onUpdate
    return decodedGraph
}