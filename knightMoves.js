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
// console.log(bfsInfo);
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


const knightMoves = (currentPosition, end, adjList = [], predecessor, movesToEnd = []) => {
    const currentKnight = Knight(currentPosition);
    const currentIndex = adjList.length;

    let possibleMoves = [];
    let predecessorPosition;

    // Initialize a sub-array for predecessor and currentPosition values
    adjList[currentIndex] = [];

    // Add predecessor to adjaceny list
    if (predecessor === undefined) {
        possibleMoves = currentKnight.getPossiblePositions();
        adjList[currentIndex].push([]);
    } else {
        // Prevent cycling by filtering out the previous move
        // from possible moves
        predecessorPosition = adjList[predecessor][1];
        currentKnight.getPossiblePositions().forEach((move) => {
            if (!checkTwoPositionsEqual(predecessorPosition, move)) possibleMoves.push(move);
        });
        
        adjList[currentIndex].push([predecessor]);
    }

    // Add current position to adjency list
    adjList[currentIndex][1] = currentPosition;

    let listLength;
    // Add possible moves from current to adjency list
    possibleMoves.forEach((move) => {
        listLength = adjList.length;
        adjList[currentIndex][0].push(listLength);
        adjList[listLength] = [[currentIndex], move];
    })

    // Do a breadth-first search on the adjacency list to get 
    // distance and predecessor information for each possible move
    // console.log(adjList)
    const bfsInfo = doBFS(adjList, currentIndex, currentPosition);

    // Check the BFS results for any moves with the end possiiton
    // and return as an array
    const endingMoves = checkBFSInfoForEndPos(bfsInfo, end);
    
    if (endingMoves.length === 0) {
        return knightMoves(adjList[currentIndex+1][1], end, adjList, currentIndex, movesToEnd);
    }

    if (movesToEnd.length === 0) {
        movesToEnd = findPredecessorMoves(endingMoves[0], bfsInfo);
    } else {
        movesToEnd.unshift(findPredecessorMoves(endingMoves[0], bfsInfo));
    }
    return movesToEnd;
}

const checkBFSInfoForEndPos = (bfsInfo, end) => {
    let endingMoves = [];
    bfsInfo.forEach((move) => {
        if (checkTwoPositionsEqual(move.data, end)) endingMoves.push(move)
    });
    return endingMoves;
}

const checkTwoPositionsEqual = (positionOne, positionTwo) => {
    return positionOne[0] === positionTwo[0] && positionOne[1] === positionTwo[1];
}

const findPredecessorMoves = (endMove, bfsInfo, movesToEnd = []) => {
    const predecessor = endMove.predecessor;
    movesToEnd.unshift(endMove.data);
    if (predecessor !== null) return findPredecessorMoves(bfsInfo[predecessor], bfsInfo, movesToEnd);
    return movesToEnd;
}

console.log("Final Result: ",knightMoves([0,0], [4,3]));
