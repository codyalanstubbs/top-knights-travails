const gameboard = [
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
];

const possibleKnightMoves = [
    [-2, -1],
    [-2, 1],
    [2, -1],
    [2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2]
]

const Knight = (currentPosition) => {

    const getNextMove = (currentPosition, move) => {
        const xCoord = currentPosition[0] + move[0];
        const yCoord = currentPosition[1] + move[1];
        return [xCoord, yCoord];
    };

    const checkNextMoveValid = (nextMove) => {
        const xCoord = nextMove[0];
        const yCoord = nextMove[1];
        return (xCoord >= 0 && yCoord >= 0 && xCoord <= 7 && yCoord <= 7) ? true : false;
    };

    const calculateNextMove = (currentPosition) => {
        let possiblePositions = [];
        let possibleMove;
        possibleKnightMoves.forEach((move) => {
            possibleMove = getNextMove(currentPosition, move);
            if (checkNextMoveValid(possibleMove)) {
                possiblePositions.push(possibleMove);
            }
        })
        return possiblePositions;
    };

    const getPossiblePositions = () => {
        return calculateNextMove(currentPosition)
    };

    const getCurrentPosition = () => {
        return currentPosition
    };

    const changePosition = (nextPosition) => {
        currentPosition = nextPosition;
        return currentPosition
    };

    return {
        getCurrentPosition,
        getPossiblePositions,
        changePosition
    };
};


/* A Queue object for queue-like functionality over JavaScript arrays. */
var Queue = function () {
    this.items = [];
};
Queue.prototype.enqueue = function (obj) {
    this.items.push(obj);
};
Queue.prototype.dequeue = function () {
    return this.items.shift();
};
Queue.prototype.isEmpty = function () {
    return this.items.length === 0;
};

/*
 * Performs a breadth-first search on a graph
 * @param {array} graph - Graph, represented as adjacency lists.
 * @param {number} source - The index of the source vertex.
 * @returns {array} Array of objects describing each vertex, like
 *     [{distance: _, predecessor: _ }]
 */
var doBFS = function (graph, source, sourceData) {
    var bfsInfo = [];

    for (var i = 0; i < graph.length; i++) {
        bfsInfo[i] = {
            distance: null,
            predecessor: null,
            data: null
        };
    }

    bfsInfo[source].distance = 0;
    bfsInfo[source].data = sourceData;
console.log(bfsInfo);
    var queue = new Queue();
    queue.enqueue(source);

    // Traverse the graph
    while (!queue.isEmpty()) { // As long as the queue is not empty:
        //  Repeatedly dequeue a vertex u from the queue.
        let u = queue.dequeue();
        //  For each neighbor v of u...
        for (let i = 0; i < graph[u][0].length; i++) {
            let v = graph[u][0][i];
            // ...that has not been visited:
            if (bfsInfo[v].distance === null) {
                
                bfsInfo[v] = {
                    distance: bfsInfo[u].distance + 1, // Set distance to 1 greater than u's distance
                    predecessor: u, // Set predecessor to u
                    data: graph[v][1]
                };

                // Enqueue v
                queue.enqueue(v);
            }
        }
    }
    return bfsInfo;
};


const knightMoves = (currentPosition, end, adjList = [], predecessor) => {
    const currentKnight = Knight(currentPosition);
    const possibleMoves = currentKnight.getPossiblePositions();
    const currentIndex = adjList.length;
    let listLength;

    adjList[currentIndex] = [];
    // Add current position to adjency list
    if (predecessor === undefined) {
        adjList[currentIndex].push([]);
    } else {
        adjList[currentIndex].push([predecessor]);
    }
    adjList[currentIndex][1] = currentPosition;

    // Add possible moves from current to adjency list
    possibleMoves.forEach((move) => {
        listLength = adjList.length;
        adjList[currentIndex][0].push(listLength);
        adjList[listLength] = [[currentIndex], move];
    })
    // console.log("adjList: ", adjList)
    const bfsInfo = doBFS(adjList, currentIndex, currentPosition);
    console.log(bfsInfo);
}

knightMoves([0,0], [1,2]);
