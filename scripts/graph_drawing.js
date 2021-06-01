/**
 * @file Valores globais e funções variadas para a renderização de grafos.
 * @author Luca Assis Argolo (luca.argolo@ufba.br)
 */

/**
 * Referência global ao elemento do canvas no HTML.
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");

/**
 * Referência global ao contexto de renderização em 2d do canvas.
 * @type {CanvasRenderingContext2D}
 */
const context = canvas.getContext("2d");

/**
 * Limpa o canvas.
 */
function clearCanvas() {
    context.fillStyle = "#11262C"
    context.rect(0, 0, canvas.width, canvas.height)
    context.fill()
}

/**
 * Desenha uma aresta qualquer no canvas.
 * @param {Edge} edge Aresta que será desenhada.
 * @param {boolean} dotted Aresta será pontilhada ou não.
 * @param {string} [overridingColor] Cor que irá sobrepor a cor original da aresta.
 */
function drawEdge(edge, dotted, overridingColor) {
    if(overridingColor != null) {
        context.strokeStyle = overridingColor
    }else{
        context.strokeStyle = "#D6FFFC"
    }
    if(dotted) {
        context.setLineDash([5, 8])
    }
    context.beginPath()
    context.moveTo(edge.vertice1.x, edge.vertice1.y)
    context.lineTo(edge.vertice2.x, edge.vertice2.y)
    if(edge.directed) {
        let length = 18

        let x = edge.vertice2.x
        let y = edge.vertice2.y

        if(!dotted) {
            let distance = Math.sqrt((edge.vertice2.x - edge.vertice1.x) * (edge.vertice2.x - edge.vertice1.x) + (edge.vertice2.y - edge.vertice1.y) * (edge.vertice2.y - edge.vertice1.y))
            let p = (verticeSize / 2) / distance
            x = edge.vertice1.x * p + edge.vertice2.x * (1 - p)
            y = edge.vertice1.y * p + edge.vertice2.y * (1 - p)
        }

        let angle = Math.atan2(y - edge.vertice1.y, x - edge.vertice1.x);
        context.moveTo(x, y);
        context.lineTo(x - length * Math.cos(angle - Math.PI / 6), y - length * Math.sin(angle - Math.PI / 6));
        context.moveTo(x, y);
        context.lineTo(x - length * Math.cos(angle + Math.PI / 6), y - length * Math.sin(angle + Math.PI / 6));
    }
    context.closePath()
    context.stroke()
    context.setLineDash([])
    if(!dotted) {
        context.fillStyle = "#FFFFFF"
        context.fillText(edge.value, (edge.vertice1.x + edge.vertice2.x) / 2, (edge.vertice1.y + edge.vertice2.y) / 2)
        context.strokeStyle = "#000000"
        context.lineWidth = 1
        context.strokeText(edge.value, (edge.vertice1.x + edge.vertice2.x) / 2, (edge.vertice1.y + edge.vertice2.y) / 2)
        context.lineWidth = 3
    }
    if(edge === graph.selectedEdge) {
        context.beginPath()
        context.ellipse((edge.vertice1.x + edge.vertice2.x)/2, (edge.vertice1.y + edge.vertice2.y)/2, edge.getDistance()/2, verticeSize/2, edge.getAngle(), 0, 2*Math.PI)
        context.closePath()
        context.strokeStyle = "#058ED9"
        context.stroke()
    }
}

/**
 * Desenha um vértice qualquer no canvas.
 * @param {Vertice} vertice Vértice que será desenhado.
 * @param {string} [overridingColor] Cor que irá sobrepor a cor original do vértice.
 */
function drawVertice(vertice, overridingColor) {
    if(overridingColor != null) {
        context.fillStyle = overridingColor
    }else if(vertice === graph.startVertice) {
        context.fillStyle = "#FFE66D"
    }else if(vertice === graph.endVertice) {
        context.fillStyle = "#FF6B6B"
    }else {
        context.fillStyle = "#00BFB3"
    }
    context.beginPath()
    context.arc(vertice.x, vertice.y, verticeSize/2, 0, 2*Math.PI)
    context.closePath()
    context.fill()
    context.fillStyle = "#FFFFFF"
    context.fillText(vertice.value, vertice.x, vertice.y)
    context.strokeStyle = "#000000"
    context.lineWidth = 1
    context.strokeText(vertice.value, vertice.x, vertice.y)
    context.lineWidth = 3
    if(vertice === graph.selectedVertice) {
        context.strokeStyle = "#058ED9"
        context.stroke()
    }
}

/**
 * Limpa o canvas e renderiza todos os elementos do grafo nele.
 * @param {Edge} [drawingEdge] Aresta que está sendo construída.
 */
function drawCanvas(drawingEdge) {
    context.lineWidth = 3
    context.font = "24px sans-serif"
    context.textAlign = "center"
    context.textBaseline = "middle"
    clearCanvas()
    if(drawingEdge != null) {
        drawEdge(drawingEdge, true)
    }
    graph.edges.forEach((edge) => {
        drawEdge(edge, false)
    })
    graph.vertices.forEach((vertice) => {
        drawVertice(vertice)
    })
}

