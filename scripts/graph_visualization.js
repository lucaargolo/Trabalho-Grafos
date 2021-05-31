const url = new URL(window.location.href);
const algorithm = url.searchParams.get("algorithm")
const encoded_graph = url.searchParams.get("graph");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const graph = decodeGraph(encoded_graph, drawCanvas)
drawCanvas()

const visualization = document.getElementById("visualization")

visualization.innerText = ` 
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

let dist = new Map()
let prev = new Map()

function dijkstra(graph, source) {

    const Q = []

    graph.vertices.forEach((v) => {
        dist.set(v, Number.POSITIVE_INFINITY)
        prev.set(v, null)
        Q.push(v)
    })
    dist.set(source, 0)

    while (Q.length > 0) {
        let u = Q.sort((a, b) => dist.get(a) - dist.get(b))[0]

        Q.splice(Q.indexOf(u), 1)

        graph.getNeighbors(u).forEach((k, v) => {
            let alt = dist.get(u) + k
            if(alt < dist.get(v)) {
                dist.set(v, alt)
                prev.set(v, u)
            }
        })
    }

}

dijkstra(graph, graph.startVertice)
console.log("A menor distância entre o vértice de início e o de fim é de: "+dist.get(graph.endVertice))
let str = ""
let e = graph.endVertice
while(e != null) {
    str += "("+e.x+", "+e.y+")"
    if(prev.get(e) != null) {
        str += " <- "
    }
    e = prev.get(e)
}
console.log(str)