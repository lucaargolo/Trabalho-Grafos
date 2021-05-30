function clearCanvas() {
    context.fillStyle = "#11262C"
    context.rect(0, 0, canvas.width, canvas.height)
    context.fill()
}

function drawEdge(edge, dotted) {
    context.strokeStyle = "#D6FFFC"
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
        drawEdge(drawingEdge, true)
    }
    graph.edges.forEach((edge) => {
        drawEdge(edge, false)
    })
    graph.vertices.forEach((vertice) => {
        drawVertice(vertice)
    })
}

