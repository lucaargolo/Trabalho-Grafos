class Dijkstra {
    pseudocode = ` 
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
    async run(graph, source) {

        let Q = []
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

            let u = Q.sort((a, b) => dist.get(a) - dist.get(b))[0]
            probingVertice = u
            probedVertices.push(probingVertice)
            await nextInstruction(12)

            Q.splice(Q.indexOf(u), 1)
            await nextInstruction(14)

            for(let [v, distance] of graph.getNeighbors(u)) {
                await nextInstruction(16)
                probingEdge = graph.getEdgeFromVertices(u, v)
                probedEdges.push(probingEdge)
                let alt = dist.get(u) + distance
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
            probingVertice = null
        }

        await nextInstruction(22)

        let result = ""
        if(graph.endVertice !== null) {
            result = "A menor distância entre o vértice de início e o de fim é de: " + dist.get(graph.endVertice)
            result += "\n"
            let e = graph.endVertice
            while (e != null) {
                result += "(" + e.x + ", " + e.y + ")"
                if (prev.get(e) != null) {
                    result += " <- "
                }
                e = prev.get(e)
            }
        }
        return result
    }

    verify(graph) {
        if(graph.startVertice === null) {
            return "Para executar o algorítmo é necessário que o grafo possua um vértice de inicio"
        }
        return null
    }

}

const algorithms = {
    "dijkstra": new Dijkstra()
}