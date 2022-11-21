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

// Queue object and doBFS below from the khan academy challenge: https://www.khanacademy.org/computing/computer-science/algorithms/breadth-first-search/pc/challenge-implement-breadth-first-search
// Modified the doBFS slightly to have position data in bfsInfo

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
            if (graph[u][0][i] === null) {
                // Skip over the null value in the 0th item in adjList
            } else {
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
    }
    return bfsInfo;
};


const buildAdjacencyList = (currentPosition, adjList = [], predecessor = null, currentIndex = 0) => {
    const currentKnight = Knight(currentPosition);
    let possibleMoves = [];
    let predecessorPosition;

    // Initialize a sub-array for predecessor and currentPosition values
    adjList[currentIndex] = [];

    // Add predecessor to adjaceny list
    if (predecessor === null) {
        currentIndex = 0;
        possibleMoves = currentKnight.getPossiblePositions();
        adjList[currentIndex].push([null]);
    } else {
        // Prevent cycling by filtering out the previous move
        // from possible moves
        predecessorPosition = adjList[predecessor][1];
        currentKnight.getPossiblePositions().forEach((move) => {
            if (!checkTwoPositionsEqual(predecessorPosition, move)) possibleMoves.push(move);
        });
        
        adjList[currentIndex].push([predecessor]);
    }

    // Add current position to adjacency list
    adjList[currentIndex][1] = currentPosition;

    let listLength;
    // Add possible moves from current to adjency list
    possibleMoves.forEach((move) => {
        listLength = adjList.length;
        adjList[currentIndex][0].push(listLength);
        adjList[listLength] = [[currentIndex], move];
    })

    adjList[currentIndex][2] = "visited";

    return adjList;
}


const knightMoves = (currentPosition, end) => {
    if (checkTwoPositionsEqual(currentPosition, end)) return "Start and end positions are the same.";
    let adjList = buildAdjacencyList(currentPosition, [], null)
    const currentIndex = adjList.length;
    
    let bfsInfo = [];
    while (!checkBFSInfoForEndPos(bfsInfo, end)) {
        adjList.forEach((move, i) => {
            if (move[2] !== 'visited') {
                adjList = buildAdjacencyList(move[1], adjList, move[0][0], i);
            }
        })
        bfsInfo = doBFS(adjList, currentIndex, currentPosition);
    }

    const endMoves = returnBFSInfoForEndPos(bfsInfo, end);
    const movesToEnd = findPredecessorsMoves(endMoves[0].data, endMoves[0].predecessor, adjList) ;

    return movesToEnd;
}

const checkBFSInfoForEndPos = (bfsInfo, end) => {
    let result = false;
    bfsInfo.forEach((move) => {
        if (move.data === null) {

        } else if (checkTwoPositionsEqual(move.data, end)) result = true;
    });
    return result;
}

const returnBFSInfoForEndPos = (bfsInfo, end) => {
    let endingMoves = [];
    bfsInfo.forEach((move) => {
        if (checkTwoPositionsEqual(move.data, end)) endingMoves.push(move)
    });
    return endingMoves;
}

const checkTwoPositionsEqual = (positionOne, positionTwo) => {
    return positionOne[0] === positionTwo[0] && positionOne[1] === positionTwo[1];
}

const findPredecessorsMoves = (endMovePosition, predecessorIndex, adjList, movesToEnd = []) => {
    movesToEnd.unshift(endMovePosition);
    if (predecessorIndex === null) {
        return movesToEnd;
    } else {  
        const predecessorPosition = adjList[predecessorIndex][1];
        const predecessorPredIndex = adjList[predecessorIndex][0][0];
        findPredecessorsMoves(predecessorPosition, predecessorPredIndex, adjList, movesToEnd);
    }
    return movesToEnd;
}