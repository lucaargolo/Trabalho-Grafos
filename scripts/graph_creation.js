const url = new URL(window.location.href);
const algorithm = url.searchParams.get("algorithm")

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let onCanvas = false
let mx = 0
let my = 0

let graph = new Graph(drawCanvas)
let draggingVertice = null
let drawingEdge = null

function importGraph() {
    navigator.clipboard.readText()
        .then(text => {
            graph = decodeGraph(text, drawCanvas)
            drawCanvas(drawingEdge)
        })
        .catch(err => {

        })
}

function exportGraph() {
    navigator.clipboard.writeText(encodeGraph(graph))
        .then(r => {

        })
        .catch(err => {

        })
}

function goToVisualization() {
    window.location = "graph_visualization.html?algorithm="+algorithm+"&graph="+encodeGraph(graph)
}

document.body.onmousemove = function (event) {
    let rect = canvas.getBoundingClientRect();
    if(event.x >= rect.left && event.x <= rect.right && event.y >= rect.top && event.y <= rect.bottom) {
        onCanvas = true
        mx = event.x - rect.left
        my = event.y - rect.top
        if(draggingVertice != null) {
            let backupX = draggingVertice.x
            let backupY = draggingVertice.y
            draggingVertice.x = mx
            draggingVertice.y = my
            if(graph.isVerticeColliding(draggingVertice)) {
                draggingVertice.x = backupX
                draggingVertice.y = backupY
            }
        }else if(graph.selectedVertice != null && drawingEdge != null) {
            drawingEdge = new Edge(graph.selectedVertice, new Vertice(mx, my), drawingEdge.directed)
        }
        drawCanvas(drawingEdge)
    }else{
        onCanvas = false
    }
}

document.body.oncontextmenu = function (event) {
    if(onCanvas) {
        event.preventDefault()
    }
}

document.body.onmousedown = function (event) {
    if(onCanvas) {
        let vertice = graph.getVertice(mx, my)
        let edge = graph.getEdge(mx, my)
        if(event.button === 0) {
            if (event.shiftKey) {
                if (vertice != null && graph.selectedVertice != null && vertice !== graph.selectedVertice) {
                    let edge = new Edge(graph.selectedVertice, vertice, false)
                    graph.addEdge(edge)
                    graph.selectedEdge = edge
                    graph.selectedVertice = null
                }
            } else if(event.ctrlKey) {
                if (vertice != null && graph.selectedVertice != null && vertice !== graph.selectedVertice) {
                    let edge = new Edge(graph.selectedVertice, vertice, true)
                    graph.addEdge(edge)
                    graph.selectedEdge = edge
                    graph.selectedVertice = null
                }
            } else {
                draggingVertice = vertice
                graph.selectedVertice = vertice
                if(vertice === null) {
                    graph.selectedEdge = edge
                }else{
                    graph.selectedEdge = null
                }
            }
        }else if(event.button === 2) {
            graph.removeEdge(edge)
            graph.removeVertice(vertice)
        }
        drawCanvas(drawingEdge)
    }
}

document.body.onmouseup = function (event) {
    if(onCanvas) {
        if(event.button === 0) {
            if(draggingVertice != null) {
                draggingVertice = null
            }else if (graph.selectedEdge == null && graph.getVertice(mx, my) == null) {
                let vertice = new Vertice(mx, my)
                let created = graph.addVertice(vertice)
                if(created) {
                    graph.selectedVertice = vertice
                    graph.selectedEdge = null
                }
            }
        }
        drawCanvas(drawingEdge)
    }
}

document.body.onkeyup = function (event) {
    switch (event.key) {
        case '+':
            if(graph.selectedVertice !== null) {
                graph.selectedVertice.value++
            }else if(graph.selectedEdge !== null) {
                graph.selectedEdge.value++
            }
            break
        case '-':
            if(graph.selectedVertice !== null) {
                graph.selectedVertice.value--
            }else if(graph.selectedEdge !== null) {
                graph.selectedEdge.value--
            }
            break
        case 's':
            if(graph.selectedVertice !== null) {
                if (graph.selectedVertice === graph.endVertice) {
                    graph.endVertice = graph.startVertice
                    graph.startVertice = graph.selectedVertice
                } else if (graph.selectedVertice === graph.startVertice) {
                    graph.startVertice = null
                } else {
                    graph.startVertice = graph.selectedVertice
                }
            }
            break
        case 'e':
            if(graph.selectedVertice !== null) {
                if (graph.selectedVertice === graph.startVertice) {
                    graph.startVertice = graph.endVertice
                    graph.endVertice = graph.selectedVertice
                } else if (graph.selectedVertice === graph.endVertice) {
                    graph.endVertice = null
                } else {
                    graph.endVertice = graph.selectedVertice
                }
            }
            break
        default:
            break
    }
    if(onCanvas && !event.shiftKey && !event.ctrlKey) {
        drawingEdge = null
    }
    drawCanvas(drawingEdge)
}

document.body.onkeydown = function (event) {
    if(onCanvas && graph.selectedVertice != null) {
        if(event.shiftKey) {
            drawingEdge = new Edge(graph.selectedVertice, new Vertice(mx, my), false)
            drawCanvas(drawingEdge)
        }else if(event.ctrlKey) {
            drawingEdge = new Edge(graph.selectedVertice, new Vertice(mx, my), true)
            drawCanvas(drawingEdge)
        }
    }
}

drawCanvas(drawingEdge)