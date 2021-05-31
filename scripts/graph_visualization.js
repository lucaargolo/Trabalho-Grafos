const url = new URL(window.location.href);
const algorithm = url.searchParams.get("algorithm")
const encoded_graph = url.searchParams.get("graph");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const graph = decodeGraph(encoded_graph, drawCanvas)
drawCanvas()

const pseudocode = document.getElementById("pseudocode")
pseudocode.innerText = algorithms[algorithm].pseudocode

//Constantes globais utilizadas para executar os algorítmos
const dist = new Map()
const prev = new Map()

//Variáveis globais utilizadas para vizualizar a execução dos algoritmos
let probedVertices = []
let probingVertice = null
let probedEdges = []
let probingEdge = null

//Varíavel global utilizada para pausar a execução do algoritmo
let blockingSteps = false

function startVisualization() {
    const result = document.getElementById("result")
    result.innerText = ""
    drawCanvas()
    let bl = startBtn.classList.contains("disabled")
    if(!bl) {
        startBtn.classList.add("disabled")
    }
    stepByStepCheckbox.disabled = true
    if(stepByStepCheckbox.checked) {
        blockingSteps = true
    }
    algorithms[algorithm].run(graph, graph.startVertice)
        .then((res) => {
            result.innerText = res
            stepByStepCheckbox.disabled = false
            if(!bl) {
                startBtn.classList.remove("disabled")
            }
            resetState()
        })
}

function nextStep() {
    if(stepByStepCheckbox.disabled) {
        blockingSteps = false
    }else{
        startVisualization()
    }
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

function resetState() {
    dist.clear()
    prev.clear()
    probedEdges = []
    probingEdge = null
    probedVertices = []
    probingVertice = null
}

const sleep = (milliseconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds)
    })
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
        if(vertice === probingVertice) {
            drawVertice(vertice, "#FF0000")
        }else if(probedVertices.indexOf(vertice) !== -1) {
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
