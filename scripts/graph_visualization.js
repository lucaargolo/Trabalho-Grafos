/**
 * @file Valores globais e funções variadas para a visualização de algoritmos em grafos.
 * @author Luca Assis Argolo (luca.argolo@ufba.br)
 */

/**
 * Constante global referente ao mapa que será usada para salvar a distância de um vértice qualquer ao vértice de início.
 * @type {Map<Vertice, number>}
 */
const dist = new Map()

/**
 * Constante global referente ao mapa que será usado para salvar um vértice anterior a outro vértice qualquer.
 * @type {Map<Vertice, Vertice>}
 */
const prev = new Map()

/**
 * Variável global referente ao array de vértices que já foram analizados pelo algoritmo.
 * @type {Vertice[]}
 */
let probedVertices = []

/**
 * Variável global contendo o vértice que está sendo analizado.
 * @type {Vertice|null}
 */
let probingVertice = null

/**
 * Variável global referente ao array de arestas que já foram analizados pelo algoritmo.
 * @type {Edge[]}
 */
let probedEdges = []

/**
 * Variável global contendo a aresta que está sendo analizada.
 * @type {Edge|null}
 */
let probingEdge = null

/**
 * Varíavel global utilizada que bloqueia a execução do programa.
 * @type {boolean}
 */
let blockingSteps = false

/**
 * Inicia a visualização do algoritmo.
 */
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

/**
 * Desbloqueia a execução do programa.
 */
function nextStep() {
    if(stepByStepCheckbox.disabled) {
        blockingSteps = false
    }else{
        startVisualization()
    }
}

/**
 * Altera a instrução do pseudocódigo e bloqueia a visualização do algoritmo, por um tempo ou até o usuário pressionar o botão "Passo Seguinte".
 * @param {number} line Linha da instrução do pseudocódigo.
 * @return {Promise<void>} Promise que bloqueia a visualização do algoritmo.
 */
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

/**
 * Reseta o estado da visualização.
 */
function resetState() {
    dist.clear()
    prev.clear()
    probedEdges = []
    probingEdge = null
    probedVertices = []
    probingVertice = null
}

/**
 * Bloqueia a vizualização do algoritmo por uma quantidade específica de tempo.
 * @param {number} milliseconds Quantidade de milisegundos que o algoritmo ficará bloqueado.
 * @return {Promise<void>} Promise que bloqueia a visualização do algoritmo.
 */
const sleep = (milliseconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds)
    })
}

/**
 * Limpa o canvas, renderiza todos os elementos do grafo nele e depois renderiza todos os elementos da visualização do algoritmo.
 */
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
