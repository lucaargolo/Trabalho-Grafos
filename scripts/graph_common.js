/**
 * @file Valores globais e funções variadas para o carregamento de grafos e visualização dos mesmos.
 * @author Luca Assis Argolo (luca.argolo@ufba.br)
 */

/**
 * Referência global ao link da página.
 * @type {URL}
 */
const url = new URL(window.location.href);

/**
 * Referência global ao algoritmo no link da página.
 * @type {string}
 */
const algorithm = url.searchParams.get("algorithm")

/**
 * Referência global ao grafo no link da página.
 * @type {string}
 */
const encoded_graph = url.searchParams.get("graph");

/**
 * Variável global contendo o grafo.
 * @type {Graph}
 */
let graph = new Graph(drawCanvas)

/**
 * Converte o grafo para um array de números e retorna uma string base64 contendo esse grafo.
 * @param {Graph} graph Grafo que será convertido.
 * @return {string} String base64.
 */
function encodeGraph(graph) {
    let encodedGraph = ""
    encodedGraph += graph.vertices.length + ";"
    graph.vertices.forEach((v) => {
        encodedGraph += v.x + ";" + v.y + ";" + v.value + ";"
    })
    encodedGraph += graph.edges.length + ";"
    graph.edges.forEach((e) => {
        encodedGraph += graph.vertices.indexOf(e.vertice1) + ";" + graph.vertices.indexOf(e.vertice2) + ";" + (e.directed ? 1 : 0) + ";" + e.value + ";"
    })
    encodedGraph += graph.vertices.indexOf(graph.startVertice) + ";"
    encodedGraph += graph.vertices.indexOf(graph.endVertice)
    return btoa(encodedGraph)
}

/**
 * Converte uma string base64 contendo um array de números em um grafo e retorna o mesmo.
 * @param {string} base64 String base64.
 * @param {function} onUpdate Função que é chamada quando o grafo sofre alterações.
 * @return {Graph} Grafo convertido.
 */
function decodeGraph(base64, onUpdate) {
    let decodedGraph = new Graph(onUpdate)
    let encodedGraph = atob(base64).split(";")
    let verticesLength = encodedGraph[0]
    for(let x = 0; x < verticesLength; x++) {
        let vertice = new Vertice(Number.parseFloat(encodedGraph[(x*3)+1]), Number.parseFloat(encodedGraph[(x*3)+2]))
        vertice.value = Number.parseInt(encodedGraph[(x*3)+3])
        decodedGraph.vertices.push(vertice)
    }
    let edgesLength = encodedGraph[(verticesLength*3)+1]
    for(let x = 0; x < edgesLength; x++) {
        let v1 = decodedGraph.vertices[encodedGraph[(verticesLength*3)+1+(x*4)+1]]
        let v2 = decodedGraph.vertices[encodedGraph[(verticesLength*3)+1+(x*4)+2]]
        let d = encodedGraph[(verticesLength*3)+1+(x*4)+3] === "1"
        let edge = new Edge(v1, v2, d)
        edge.value = Number.parseInt(encodedGraph[(verticesLength*3)+1+(x*4)+4])
        decodedGraph.edges.push(edge)
    }
    let start = encodedGraph[(verticesLength*3)+1+(edgesLength*4)+1]
    if(start >= 0) {
        decodedGraph.startVertice = decodedGraph.vertices[start]
    }
    let end = encodedGraph[(verticesLength*3)+1+(edgesLength*4)+2]
    if(end >= 0) {
        decodedGraph.endVertice = decodedGraph.vertices[end]
    }
    decodedGraph.onUpdate = onUpdate
    return decodedGraph
}

/**
 * Importa o grafo da área de transferência do usuário.
 */
function importGraph() {
    navigator.clipboard.readText()
        .then(text => {
            graph = decodeGraph(text, drawCanvas)
            drawCanvas(drawingEdge)
            alert("Grafo da área de transferência importado com sucesso!")
        })
        .catch(err => {
            alert("Houve um erro ao importar o grafo da área de transferência. Certifique-se de que sua área de transferência possui de fato um grafo.")
            console.error(err.message)
        })
}

/**
 * Exporta o grafo para a área de transferência do usuário.
 */
function exportGraph() {
    navigator.clipboard.writeText(encodeGraph(graph))
        .then(() => {
            alert("Grafo exportado para a área de transferência com sucesso!")
        })
        .catch(err => {
            alert("Houve um erro ao exportar o grafo para a área de transferência. Certifique-se de que o site possuí permissão para efetuar essa ação.")
            console.error(err.message)
        })
}

/**
 * Código ao ser executado ao fim do carregamento do script.
 */
if(encoded_graph != null) {
    try {
        graph = decodeGraph(encoded_graph, drawCanvas)
    }catch (err) {
        console.error(err.message)
    }
}
drawCanvas()