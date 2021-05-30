const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let onCanvas = false
let mx = 0
let my = 0

const graph = new Graph(drawCanvas)
let draggingVertice = null
let drawingEdge = null

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
        if(event.button === 0) {
            if (event.shiftKey) {
                if (vertice != null && graph.selectedVertice != null && vertice !== graph.selectedVertice) {
                    graph.addEdge(new Edge(graph.selectedVertice, vertice, false))
                }
            } else if(event.ctrlKey) {
                if (vertice != null && graph.selectedVertice != null && vertice !== graph.selectedVertice) {
                    graph.addEdge(new Edge(graph.selectedVertice, vertice, true))
                }
            } else {
                draggingVertice = vertice
                graph.selectedVertice = vertice
            }
        }else if(event.button === 2) {
            if (event.shiftKey || event.ctrlKey) {
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
        drawCanvas(drawingEdge)
    }
}

document.body.onmouseup = function (event) {
    if(onCanvas) {
        if(event.button === 0) {
            if(draggingVertice != null) {
                draggingVertice = null
            }else if (graph.getVertice(mx, my) == null) {
                let vertice = new Vertice(mx, my)
                let created = graph.addVertice(vertice)
                if(created) {
                    graph.selectedVertice = vertice
                }
            }
        }
        drawCanvas(drawingEdge)
    }
}

document.body.onkeyup = function (event) {
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
        drawCanvas(drawingEdge)
    }
    if(onCanvas && !event.shiftKey && !event.ctrlKey) {
        drawingEdge = null
        drawCanvas(drawingEdge)
    }
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