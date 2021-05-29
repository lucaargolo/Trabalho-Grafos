const canvas = document.getElementById("canvas");
const rect = canvas.getBoundingClientRect();
const context = canvas.getContext("2d");
let onCanvas = false

const graph = new Graph(drawCanvas)
let selectedVertice = null
let draggingVertice = null
let drawingEdge = null

document.body.oncontextmenu = function (event) {
    if(onCanvas) {
        event.preventDefault()
    }
}

document.body.onmousedown = function (event) {
    if(onCanvas) {
        let vertice = graph.getVertice(event.x - rect.left, event.y - rect.top)
        if(event.button === 0) {
            if (event.shiftKey) {
                if (vertice != null && selectedVertice != null && vertice !== selectedVertice) {
                    graph.addEdge(new Edge(selectedVertice, vertice))
                    drawingEdge = null
                }
            } else {
                draggingVertice = vertice
                selectedVertice = vertice
            }
        }else if(event.button === 2) {
            if (event.shiftKey) {
                if(vertice != null && selectedVertice != null && vertice !== selectedVertice) {
                    let edge = graph.getEdge(selectedVertice, vertice)
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
        if(event.button === 0) {
            if(draggingVertice != null) {
                draggingVertice = null
            }else if (graph.getVertice(event.x - rect.left, event.y - rect.top) == null) {
                let vertice = new Vertice(event.x - rect.left, event.y - rect.top)
                let created = graph.addVertice(vertice)
                if(created) {
                    selectedVertice = vertice
                }
            }
        }
        drawCanvas()
    }
}

document.body.onmousemove = function (event) {
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
        }else if(selectedVertice != null && event.shiftKey) {
            drawingEdge = new Edge(selectedVertice, new Vertice(event.x - rect.left, event.y - rect.top))
        }else{
            drawingEdge = null
        }
        drawCanvas()
    }
}

document.body.onkeypress = function (event) {
    switch (event.key) {
        case '+':
            if(selectedVertice != null) {
                selectedVertice.value++
            }
            break
        case '-':
            if(selectedVertice != null) {
                selectedVertice.value--
            }
            break
        default:
            break
    }
    drawCanvas()
}

drawCanvas()
