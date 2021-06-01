/**
 * @file Classes e valores utilizados para representação de grafos.
 * @author Luca Assis Argolo (luca.argolo@ufba.br)
 */

/**
 * Diámetro do vértice.
 * @type {number}
 */
const verticeSize = 40

/**
 * @classdesc Representação de um vértice com peso.
 */
class Vertice {

    /**
     * Cria um novo vértice com peso 0.
     * @param {number} x Coordenada X do vértice.
     * @param {number} y Coordenada Y do vértice.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = 0
    }

    /**
     * Verifica se um outro vértice qualquer está colidindo com esse vértice.
     * @param {Vertice} vertice Vértice que será verificado.
     * @return {boolean} Vértice está colidindo ou não com esse vértice.
     */
    isColliding(vertice) {
        let distSq = (this.x - vertice.x) * (this.x - vertice.x) + (this.y - vertice.y) * (this.y - vertice.y);
        let radSumSq = verticeSize * verticeSize;
        return (distSq !== radSumSq && distSq <= radSumSq)
    }

    /**
     * Verifica se um ponto (x, y) está dentro desse vértice.
     * @param {number} x Coordenada X do plano.
     * @param {number} y Coordenada Y do plano.
     * @return {boolean} Ponto está dentro ou não desse vértice.
     */
    isPointInside(x, y) {
        return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) <= (verticeSize/2)*(verticeSize/2)
    }
}

/**
 * @classdesc Representação de uma aresta qualquer com peso.
 */
class Edge {

    /**
     * Cria uma nova aresta entre dois vértices com peso 0.
     * @param {Vertice} vertice1 Vértice de onde a aresta sai.
     * @param {Vertice} vertice2 Vértice onde a aresta chega.
     * @param {boolean} directed Aresta é direcionada ou não.
     */
    constructor(vertice1, vertice2, directed) {
        this.vertice1 = vertice1
        this.vertice2 = vertice2
        this.value = 0
        this.directed = directed
    }

    /**
     * Retorna o angulo dessa aresta.
     * @return {number} Angulo dessa aresta.
     */
    getAngle() {
        return Math.atan2(this.vertice2.y - this.vertice1.y, this.vertice2.x - this.vertice1.x)
    }

    /**
     * Retorna a distância entre os dois vértices dessa aresta.
     * @return {number} Distância entre os dois vértices dessa aresta.
     */
    getDistance() {
        return Math.sqrt((this.vertice2.x - this.vertice1.x) * (this.vertice2.x - this.vertice1.x) + (this.vertice2.y - this.vertice1.y) * (this.vertice2.y - this.vertice1.y))
    }

    /**
     * Verifica se essa aresta é igual a outra aresta qualquer.
     * @param {Edge} edge Aresta que será verificada.
     * @return {boolean} As arestas são iguais ou não.
     */
    isEqual(edge) {
        return (this.vertice1 === edge.vertice1 && this.vertice2 === edge.vertice2) || (this.vertice2 === edge.vertice1 && this.vertice1 === edge.vertice2)
    }

    /**
     * Verifica se um ponto (x, y) está dentro da elipse que engloba essa aresta.
     * @param {number} x Coordenada X do plano.
     * @param {number} y Coordenada Y do plano.
     * @return {boolean} Ponto está dentro ou não da elipse.
     */
    isPointInside(x, y) {
        let first = Math.pow(Math.cos(this.getAngle())*(x-((this.vertice1.x + this.vertice2.x)/2))+Math.sin(this.getAngle())*(y-((this.vertice1.y + this.vertice2.y)/2)), 2)/Math.pow(this.getDistance()/2, 2)
        let second = Math.pow(Math.sin(this.getAngle())*(x-((this.vertice1.x + this.vertice2.x)/2))-Math.cos(this.getAngle())*(y-((this.vertice1.y + this.vertice2.y)/2)), 2)/Math.pow(verticeSize/2, 2)
        return first + second <= 1
    }
}

/**
 * @classdesc Representação de um grafo qualquer
 */
class Graph {

    /**
     * Cria uma novo grafo
     * @param {function} onUpdate Função que é chamada quando o grafo sofre alterações
     */
    constructor(onUpdate) {
        this.selectedVertice = null
        this.selectedEdge = null
        this.startVertice = null
        this.endVertice = null
        this.vertices = []
        this.edges = []
        this.onUpdate = onUpdate
    }

    /**
     * Retorna o grafo ao seu estado inicial
     */
    clear() {
        this.selectedVertice = null
        this.selectedEdge = null
        this.startVertice = null
        this.endVertice = null
        this.vertices = []
        this.edges = []
        this.onUpdate()
    }

    /**
     * Retorna todos os vizinhos de um vértice do grafo e o peso da aresta entre eles.
     * @param {Vertice} vertice Vertice que terá seus vizinhos retornados.
     * @return {Map<Vertice, number>} Mapa com (vizinho) -> (peso da aresta)
     */
    getNeighbors(vertice) {
        let neighbors = new Map()
        this.edges.forEach((e) => {
            if(e.directed && vertice === e.vertice1) {
                neighbors.set(e.vertice2, e.value)
            }else if(!e.directed) {
                if(vertice === e.vertice1) {
                    neighbors.set(e.vertice2, e.value)
                }else if(vertice === e.vertice2) {
                    neighbors.set(e.vertice1, e.value)
                }
            }
        })
        return neighbors
    }

    /**
     * Retorna um vértice presente nas coordenadas (x, y) ou null caso não exista vértice no local.
     * @param {number} x Coordenada X do plano.
     * @param {number} y Coordenada Y do plano.
     * @return {Vertice|null} Vértice nas coordenadas ou nulo caso não exista vértice no local.
     */
    getVertice(x, y) {
        let vertice = null
        this.vertices.forEach((v) => {
            if(v.isPointInside(x, y)) {
                vertice = v
                this.onUpdate()
            }
        })
        return vertice
    }

    /**
     * Adiciona um vértice ao grafo e retorna se a operação foi concluída com sucesso ou não.
     * @param {Vertice} vertice Vértice que será adicionado ao grafo.
     * @return {boolean} Operação foi concluida com sucesso ou não.
     */
    addVertice(vertice) {
        let colliding = this.isVerticeColliding(vertice)
        if(!colliding) {
            this.vertices.push(vertice)
            this.onUpdate()
        }
        return !colliding
    }

    /**
     * Remove um vértice do grafo e todas as arestas ligadas ao mesmo.
     * @param {Vertice} vertice Vértice que será removido do grafo.
     */
    removeVertice(vertice) {
        const index = this.vertices.indexOf(vertice);
        if (index > -1) {
            this.vertices.splice(index, 1);
            let edgesToRemove = []
            this.edges.forEach((e) => {
                if(vertice === e.vertice1 || vertice === e.vertice2) {
                    edgesToRemove.push(e)
                }
            })
            edgesToRemove.forEach((e) => {
                this.removeEdge(e)
            })
        }
    }

    /**
     * Verifica se um vértice qualquer está colidindo com qualquer outro vértice do grafo.
     * @param {Vertice} vertice Vértice que será testado para colisão.
     * @return {boolean} O vértice colide com outro vértice ou não.
     */
    isVerticeColliding(vertice) {
        let colliding = false
        this.vertices.forEach((v) => {
            if(v !== vertice && v.isColliding(vertice)) {
                colliding = true
            }
        })
        return colliding
    }

    /**
     * Retorna uma aresta presente nas coordenadas (x, y) ou null caso não exista aresta no local.
     * @param {number} x Coordenada X no plano.
     * @param {number} y Coordenada Y no plano.
     * @return {Edge|null} Aresta nas coordenadas ou nulo caso não exista aresta no local.
     */
    getEdge(x, y) {
        let edge = null
        this.edges.forEach((e) => {
            if(e.isPointInside(x, y)) {
                edge = e
                this.onUpdate()
            }
        })
        return edge
    }

    /**
     * Retorna uma aresta ligando os dois vértices ou null caso não exista tal aresta.
     * @param {Vertice} vertice1 Vértice de onde a aresta sai.
     * @param {Vertice} vertice2 Vértice onde a aresta chega.
     * @return {Edge|null} Aresta entre os vértices passados ou nulo caso não exista tal aresta.
     */
    getEdgeFromVertices(vertice1, vertice2) {
        let edge = null
        this.edges.forEach((e) => {
            if((e.directed && e.vertice1 === vertice1 && e.vertice2 === vertice2) || (!e.directed && ((e.vertice1 === vertice1 && e.vertice2 === vertice2) || e.vertice1 === vertice2 && e.vertice2 === vertice1)) ) {
                edge = e
            }
        })
        return edge
    }

    /**
     * Adiciona uma aresta ao grafo e retorna se a operação foi concluída com sucesso ou não.
     * @param {Edge} edge Aresta que será adicionada ao grafo.
     * @return {boolean} Operação foi concluida com sucesso ou não.
     */
    addEdge(edge) {
        let colliding = false
        this.edges.forEach((e) => {
            if(e.isEqual(edge)) {
                colliding = true
            }
        })
        if(!colliding) {
            this.edges.push(edge)
            this.onUpdate()
        }
        return !colliding
    }

    /**
     * Remove uma aresta do grafo.
     * @param {Edge} edge Aresta que será removida do grafo.
     */
    removeEdge(edge) {
        const index = this.edges.indexOf(edge);
        if (index > -1) {
            this.edges.splice(index, 1);
        }
    }
}