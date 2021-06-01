/**
 * @file Valores globais e funções variadas para a criação de grafos.
 * @author Luca Assis Argolo (luca.argolo@ufba.br)
 */

/**
 * Variável global que indica se o mouse do usuário está ou não no canvas.
 * @type {boolean}
 */
let onCanvas = false

/**
 * Varíavel global que indica a coordenada X do mouse do usuário no canvas.
 * @type {number}
 */
let mx = 0

/**
 * Varíavel global que indica a coordenada Y do mouse do usuário no canvas.
 * @type {number}
 */
let my = 0

/**
 * Varíavel global que contém o vértice que está sendo arrastado, ou nulo caso não exista tal vértice.
 * @type {Vertice|null}
 */
let draggingVertice = null

/**
 * Varíavel global que contém a aresta que está sendo construída, ou nulo caso não exista tal aresta.
 * @type {null}
 */
let drawingEdge = null

/**
 * Função que executa toda a vez que o usuário movimentar o mouse.
 * @listens onmousemove
 */
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

/**
 * Função que executa toda a vez que o usuário tentar abrir o menu de contexto.
 * @listens oncontextmenu
 */
document.body.oncontextmenu = function (event) {
    if(onCanvas) {
        event.preventDefault()
    }
}

/**
 * Função que executa toda a vez que o usuário pressiona algum botão do mouse.
 * @listens onmousedown
 */
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
            if(vertice !== null) {
                graph.removeVertice(vertice)
            }else{
                graph.removeEdge(edge)
            }
        }
        drawCanvas(drawingEdge)
    }
}

/**
 * Função que executa toda a vez que o usuário solta algum botão do mouse.
 * @listens onmouseup
 */
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

/**
 * Função que executa toda a vez que o usuário pressiona alguma tecla do teclado.
 * @listens onkeydown
 */
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

/**
 * Função que executa toda a vez que o usuário solta alguma tecla do teclado.
 * @listens onkeyup
 */
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