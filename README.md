# MATA53 - Visualização de Algoritmos em Grafos
![image](https://user-images.githubusercontent.com/49497195/120156745-a7eed800-c1c8-11eb-99ca-03c68c9f0d48.png)
Link de acesso a ferramenta: https://lucaargolo.github.io/trabalho-grafos

## Tabela de Conteúdos
1. [Autor](#autor)
2. [Trabalho](#trabalho)
3. [Dijkstra's algorithm](#dijkstras-algorithm)
   1. [Pseudocódigo](#pseudocódigo)
5. [Instruções](#instruções)
   1. [Execução](#execução)
   2. [Uso](#uso)
7. [Implementação](#implementação)
   1. [Processo de Desenvolvimento](#processo-de-desenvolvimento)
   2. [Recursos](#recursos)
   3. [Algoritmos](#algoritmos)
8. [Documentação](#documentação)
9. [Referências](#referências)

## Autor

Nome: Luca Assis Argolo

Matrícula: 219116049

Algoritmo: Dijkstra's algorithm 

## Trabalho

Proposto pela cordenação da disciplina MATA53, para execução durante o semestre 2021.1, esse trabalho consiste na implementação de uma ferramenta que permita a visualização de algoritmos em grafos, para atrair a atenção de pessoas interessadas nesses assuntos.

## Dijkstra's algorithm

O [algoritmo de Dijkstra](https://pt.wikipedia.org/wiki/Algoritmo_de_Dijkstra), é um algoritmo simples que visa resolver o [problema do caminho mais curto](https://pt.wikipedia.org/wiki/Problema_do_caminho_mais_curto) num grafo dirigido ou não dirigido com arestas de peso não negativo.

Foi concebido pelo cientista da computação [Edsger W. Dijkstra](https://pt.wikipedia.org/wiki/Edsger_Dijkstra) em 1956 e publicado 3 anos depois.

### Pseudocódigo

```
 1  function Dijkstra(Graph, source):
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
16          for each neighbor v of u:           // only v that are still in Q
17              alt ← dist[u] + length(u, v)
18              if alt < dist[v]:              
19                  dist[v] ← alt
20                  prev[v] ← u
21
22      return dist[], prev[]
```

## Instruções

### Execução

Para executar o programa na sua maquina, basta clonar o repositório e abrir o arquivo `ìndex.html` presente na pasta raiz do projeto.

**Requisitos:** Estar utilizando um navegador moderno (Google Chrome, Firefox, Opera, Safari, Edge...) certificando-se de que o mesmo esteja devidamente atualizado.

### Uso

Para efetuar o uso do programa, o usuário deverá escolher o algoritmo que quer visualizar e escolher se quer utilizar um grafo predefinido para a visualização, ou quer criar o próprio grafo. Após escolher a opção desejada clicar em "Continuar".

#### 1. Criando o próprio grafo

Caso o usuário decida criar o próprio grafo, ele irá ser redirecionado a página de criação de grafos, onde será disponibilizado uma lista de instruções para que o usuário possa criar o seu próprio grafo.

Após finalizar sua criação, o usuário deverá clicar em "Continuar" e caso haja algum problema de validação, o site informará o erro e o usuário terá que concertá-lo para poder prosseguir. Caso não haja nenhum erro o usuário será redirecionado para a página de visualização.

#### 2. Visualizando o algoritmo escolhido no grafo

Dentro da página de visualização o usuário tem 2 opções. Ou ele irá clicar em "Iniciar Visualização", o que irar dar play na visualização até o final dela, ou ele poderá selecionar a opção "Passo a Passo", e executar a visualização operação por operação.

## Implementação

Neste repositório está contido um site para visualização de algoritmos em grafos.

### Processo de Desenvolvimento

O site foi desenvolvido utilizando a linguagem de marcação **HTML5**, style sheets em **CSS3** e a linguagem de programação **JavaScript**, com auxilio do framework para front-end **Bootstrap**.

### Recursos

No momento atual o site possui os seguintes recursos:

- Visualização de algoritmos em grafos step-by-step em tempo real
- Grafos pré-definidos para utilização rápida
- Construtor interativo de grafos para casos de uso mais complexos
- Exportação e Importação de grafos construidos

### Algoritmos

No momento atual o site possui os seguintes algoritmos:

- Dijkstra's algorithm

## Documentação

Todo o código javascript do projeto foi documentado seguindo o padrão do **JSDoc**

A página web com a documentação pode ser acessada em https://lucaargolo.github.io/trabalho-grafos/docs

## Referências

- Dijkstra's algorithm (EN): https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
- Dijkstra's algorithm (PT): https://pt.wikipedia.org/wiki/Algoritmo_de_Dijkstra
- HTML: https://developer.mozilla.org/pt-BR/docs/Glossary/HTML
- CSS: https://developer.mozilla.org/pt-BR/docs/Glossary/CSS
- JavaScript: https://developer.mozilla.org/pt-BR/docs/Glossary/JavaScript 
- Bootstrap: https://getbootstrap.com/docs/5.0/getting-started/introduction/
- JSDoc: https://jsdoc.app/about-getting-started.html
