function clearCanvas() {
    context.fillStyle = "#11262C"
    context.rect(0, 0, canvas.width, canvas.height)
    context.fill()
}

function drawEdge(edge) {
    context.strokeStyle = "#D6FFFC"
    context.beginPath()
    context.moveTo(edge.vertice1.x, edge.vertice1.y)
    context.lineTo(edge.vertice2.x, edge.vertice2.y)
    context.closePath()
    context.stroke()
}

function drawVertice(vertice) {
    if(vertice === graph.startVertice) {
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
    context.fillStyle = "#D6FFFC"
    context.font = "16px sans-serif"
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillText(vertice.value, vertice.x, vertice.y)
    if(vertice === graph.selectedVertice) {
        context.strokeStyle = "#D6FFFC"
        context.stroke()
    }
}

function drawCanvas(drawingEdge) {
    context.lineWidth = 3
    clearCanvas()
    if(drawingEdge != null) {
        context.setLineDash([5, 8])
        drawEdge(drawingEdge)
        context.setLineDash([])
    }
    graph.edges.forEach((edge) => {
        drawEdge(edge)
    })
    graph.vertices.forEach((vertice) => {
        drawVertice(vertice)
    })
}

