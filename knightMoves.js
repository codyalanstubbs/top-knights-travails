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

const knightMoves = (aKnight, end) => {
    const x = aKnight.getCurrentPosition()[0];
    const y = aKnight.getCurrentPosition()[1];
    if (x === end[0] && y === end[1]) return "end";

    const possibilities = aKnight.getPossiblePositions();
    for (let i = 0; i < possibilities.length; i++) {
        possibilities[i] = possibilities[i].join("");
    }

    if (possibilities.includes(end.join(""))) {
        console.log("It's there!");
        console.log(possibilities.indexOf(end.join("")));
    } else {
        knightMoves()
    }  
    console.log(possibilities);
}

knightMoves(Knight([0,0]), [1,2]);

// var adjList = [
//     [[1,2,3,4,5,6,7,8], ["d0"]],
//     [[0,9,10,11,12,13,14,15,16], ["d1"]],
//     [[0], ["d2"]],
//     [[0], ["d3"]],
//     [[0], ["d4"]],
//     [[0], ["d5"]],
//     [[0], ["d6"]],
//     [[0], ["d7"]],
//     [[0], ["d8"]],
//     [[1], ["d9"]],
//     [[1], ["d10"]],
//     [[1], ["d11"]],
//     [[1], ["d12"]],
//     [[1], ["d13"]],
//     [[1], ["d14"]],
//     [[1], ["d15"]],
//     [[1], ["d16"]]
// ];

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