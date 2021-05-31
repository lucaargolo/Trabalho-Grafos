const url = new URL(window.location.href);
const algorithm = url.searchParams.get("algorithm")
const encoded_graph = url.searchParams.get("graph");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const graph = decodeGraph(encoded_graph, drawCanvas)
drawCanvas()

const pseudocode = document.getElementById("pseudocode")

const startBtn = document.getElementById("startBtn")
const nextStepBtn = document.getElementById("nextStepBtn")

const stepSpeedRange = document.getElementById("stepSpeed")
const stepByStepCheckbox = document.getElementById("stepByStep")

const speedDisplay = document.getElementById("speedDisplay")

stepByStepCheckbox.onchange = function () {
    if(stepByStepCheckbox.checked) {
        stepSpeedRange.disabled = true
        startBtn.classList.add("disabled")
        nextStepBtn.classList.remove("disabled")
    }else{
        stepSpeedRange.disabled = false
        startBtn.classList.remove("disabled")
        nextStepBtn.classList.add("disabled")
    }
}

stepSpeedRange.onchange = function () {
    speedDisplay.innerText = stepSpeedRange.value*10 + "ms"
}

pseudocode.innerText = ` 
=>  1  function Dijkstra(Graph, source):
    2
    3      create vertex set Q
    4
    5      for each vertex v in Graph:            
    6          dist[v] ← INFINITY                 
    7          prev[v] ← UNDEFINED                
    8          add v to Q                     
    9      dist[source] ← 0                       
   10     
   11      while Q is not empty:
   12          u ← vertex in Q with min dist[u]   
   13                                             
   14          remove u from Q
   15         
   16          for each neighbor v of u:
   17              alt ← dist[u] + length(u, v)
   18              if alt < dist[v]:              
   19                  dist[v] ← alt
   20                  prev[v] ← u
   21
   22      return dist[], prev[]
`

let blockingSteps = false

function resetState() {
    dist.clear()
    prev.clear()
    Q = []
    u = null
    alt = null
    probedEdges = []
    probingEdge = null
}

function nextStep() {
    if(stepByStepCheckbox.disabled) {
        blockingSteps = false
    }else{
        startVisualization()
    }
}

function startVisualization() {
    const result = document.getElementById("result")
    result.innerText = ""
    drawCanvas()
    stepByStepCheckbox.disabled = true
    if(stepByStepCheckbox.checked) {
        blockingSteps = true
    }
    dijkstra(graph, graph.startVertice)
        .then(() => {
            result.innerText += "A menor distância entre o vértice de início e o de fim é de: " + dist.get(graph.endVertice)
            result.innerText += "\n"
            let e = graph.endVertice
            while (e != null) {
                result.innerText += "(" + e.x + ", " + e.y + ")"
                if (prev.get(e) != null) {
                    result.innerText += " <- "
                }
                e = prev.get(e)
            }
            stepByStepCheckbox.disabled = false
            resetState()
        })
}

const dist = new Map()
const prev = new Map()
let Q = []
let u = null
let alt = null
let probedEdges = []
let probingEdge = null

const sleep = (milliseconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds)
    })
}

async function dijkstra(graph, source) {

    Q = []
    await nextInstruction(3)

    for(let v of graph.vertices) {
        await nextInstruction(5)
        dist.set(v, Number.POSITIVE_INFINITY)
        await nextInstruction(6)
        prev.set(v, null)
        await nextInstruction(7)
        Q.push(v)
        await nextInstruction(8)
    }

    dist.set(source, 0)
    await nextInstruction(9)

    while (Q.length > 0) {
        await nextInstruction(11)

        u = Q.sort((a, b) => dist.get(a) - dist.get(b))[0]
        await nextInstruction(12)

        Q.splice(Q.indexOf(u), 1)
        await nextInstruction(14)

        for(let [v, distance] of graph.getNeighbors(u)) {
            await nextInstruction(16)
            probingEdge = graph.getEdgeFromVertices(u, v)
            probedEdges.push(probingEdge)
            alt = dist.get(u) + distance
            await nextInstruction(17)
            if(alt < dist.get(v)) {
                await nextInstruction(18)
                dist.set(v, alt)
                await nextInstruction(19)
                prev.set(v, u)
                await nextInstruction(20)
            }
            probingEdge = null
        }
        u = null
    }

    await nextInstruction(22)
}

async function nextInstruction(line) {
    pseudocode.innerText = pseudocode.innerText.replace("=>", "  ")
    pseudocode.innerText = pseudocode.innerText.replace("   "+line, "=> "+line)
    if(blockingSteps) {
        while (blockingSteps) {
            await sleep(50)
        }
    }else{
        await sleep(stepSpeedRange.value*10)
    }
    drawVisualizationCanvas()
    if(stepByStepCheckbox.checked) {
        blockingSteps = true
    }
}

function drawVisualizationCanvas() {
    context.lineWidth = 3
    context.font = "24px sans-serif"
    context.textAlign = "center"
    context.textBaseline = "middle"
    clearCanvas()
    graph.edges.forEach((edge) => {
        if(edge === probingEdge) {
            drawEdge(edge, false, "#FF0000")
        }else if(probedEdges.indexOf(edge) !== -1) {
            drawEdge(edge, false, "#00FF00")
        }else{
            drawEdge(edge, false)
        }
    })
    graph.vertices.forEach((vertice) => {
        if(vertice === u) {
            drawVertice(vertice, "#FF0000")
        }else if(dist.has(vertice) && Q.indexOf(vertice) === -1) {
            drawVertice(vertice, "#00FF00")
        }else{
            drawVertice(vertice)
        }
    })
    context.font = "16px sans-serif"
    context.fillStyle = "#FF0000"
    dist.forEach((dist, vertice) => {
        let str = ""
        if(vertice === graph.startVertice) {
            str += "source, "
        }else if(vertice === graph.endVertice) {
            str += "destination, "
        }
        str += dist
        context.fillText(str, vertice.x, vertice.y - verticeSize/2 - 5)
    })
}
