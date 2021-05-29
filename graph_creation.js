const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let onCanvas = false

const graph = new Graph(drawCanvas)
let draggingVertice = null
let drawingEdge = null

document.body.onmousemove = function (event) {
    let rect = canvas.getBoundingClientRect();
    if(event.x >= rect.left && event.x <= rect.right && event.y >= rect.top && event.y <= rect.bottom) {
        onCanvas = true
        if(draggingVertice != null) {
            let backupX = draggingVertice.x
            let backupY = draggingVertice.y
            draggingVertice.x = event.x - rect.left
            draggingVertice.y = event.y - rect.top
            if(graph.isVerticeColliding(draggingVertice)) {
                draggingVertice.x = backupX
                draggingVertice.y = backupY
            }
        }else if(graph.selectedVertice != null && event.shiftKey) {
            drawingEdge = new Edge(graph.selectedVertice, new Vertice(event.x - rect.left, event.y - rect.top))
        }else{
            drawingEdge = null
        }
        drawCanvas()
    }
}

document.body.oncontextmenu = function (event) {
    if(onCanvas) {
        event.preventDefault()
    }
}

document.body.onmousedown = function (event) {
    if(onCanvas) {
        let rect = canvas.getBoundingClientRect();
        let vertice = graph.getVertice(event.x - rect.left, event.y - rect.top)
        if(event.button === 0) {
            if (event.shiftKey) {
                if (vertice != null && graph.selectedVertice != null && vertice !== graph.selectedVertice) {
                    graph.addEdge(new Edge(graph.selectedVertice, vertice))
                    drawingEdge = null
                }
            } else {
                draggingVertice = vertice
                graph.selectedVertice = vertice
            }
        }else if(event.button === 2) {
            if (event.shiftKey) {
                if(vertice != null && graph.selectedVertice != null && vertice !== graph.selectedVertice) {
                    let edge = graph.getEdge(graph.selectedVertice, vertice)
                    if(edge != null) {
                        graph.removeEdge(edge)
                    }
                }
            } else {
                graph.removeVertice(vertice)
            }
        }
        drawCanvas()
    }
}

document.body.onmouseup = function (event) {
    if(onCanvas) {
        let rect = canvas.getBoundingClientRect();
        if(event.button === 0) {
            if(draggingVertice != null) {
                draggingVertice = null
            }else if (graph.getVertice(event.x - rect.left, event.y - rect.top) == null) {
                let vertice = new Vertice(event.x - rect.left, event.y - rect.top)
                let created = graph.addVertice(vertice)
                if(created) {
                    graph.selectedVertice = vertice
                }
            }
        }
        drawCanvas()
    }
}

document.body.onkeypress = function (event) {
    if (graph.selectedVertice != null) {
        switch (event.key) {
            case '+':
                graph.selectedVertice.value++
                break
            case '-':
                graph.selectedVertice.value--
                break
            case 's':
                if(graph.selectedVertice === graph.endVertice) {
                    graph.endVertice = graph.startVertice
                    graph.startVertice = graph.selectedVertice
                }else if(graph.selectedVertice === graph.startVertice) {
                    graph.startVertice = null
                }else{
                    graph.startVertice = graph.selectedVertice
                }
                break
            case 'e':
                if(graph.selectedVertice === graph.startVertice) {
                    graph.startVertice = graph.endVertice
                    graph.endVertice = graph.selectedVertice
                }else if(graph.selectedVertice === graph.endVertice) {
                    graph.endVertice = null
                }else{
                    graph.endVertice = graph.selectedVertice
                }
                break
            default:
                break
        }
        drawCanvas()
    }
}

drawCanvas()
