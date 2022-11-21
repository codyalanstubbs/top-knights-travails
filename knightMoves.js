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

// Driver code to test out all possible combos of start and end positions
let x = [0,1,2,3,4,5,6,7];
let y = [0,1,2,3,4,5,6,7];

let combos = combineArrays([x, y] )
let uniqueCombos = combos.filter((c, index) => {
    return combos.indexOf(c) === index;
});

let comboCombos = combineArrays([combos, combos]);
let uniqueComboCombos = comboCombos.filter((c, index) => {
    return comboCombos.indexOf(c) === index;
});

let successCounts = 0;
let failureCounts = 0;
uniqueComboCombos.forEach((combo) => {
    const comb1 = [Number(combo.split("")[0]), Number(combo.split("")[1])];
    const comb2 = [Number(combo.split("")[2]), Number(combo.split("")[3])];
    (knightMoves(comb1, comb2).length !== 0) ? successCounts++ : failureCounts++;

})


console.log("Possible Start-End Combos: ", uniqueComboCombos.length)
console.log("Paths Found: ", successCounts)
console.log("Paths Not Found: ", failureCounts)

// The functions below come from https://stackoverflow.com/questions/8936610/how-can-i-create-every-combination-possible-for-the-contents-of-two-arrays
// These are used above to test if all possible starting and ending position combos
// can be solved by the knightMoves function
function combineArrays( array_of_arrays ){

    // First, handle some degenerate cases...

    if( ! array_of_arrays ){
        // Or maybe we should toss an exception...?
        return [];
    }

    if( ! Array.isArray( array_of_arrays ) ){
        // Or maybe we should toss an exception...?
        return [];
    }

    if( array_of_arrays.length == 0 ){
        return [];
    }

    for( let i = 0 ; i < array_of_arrays.length; i++ ){
        if( ! Array.isArray(array_of_arrays[i]) || array_of_arrays[i].length == 0 ){
            // If any of the arrays in array_of_arrays are not arrays or zero-length, return an empty array...
            return [];
        }
    }

    // Done with degenerate cases...

    // Start "odometer" with a 0 for each array in array_of_arrays.
    let odometer = new Array( array_of_arrays.length );
    odometer.fill( 0 ); 

    let output = [];

    let newCombination = formCombination( odometer, array_of_arrays );

    output.push( newCombination );

    while ( odometer_increment( odometer, array_of_arrays ) ){
        newCombination = formCombination( odometer, array_of_arrays );
        output.push( newCombination );
    }

    return output;
}/* combineArrays() */


// Translate "odometer" to combinations from array_of_arrays
function formCombination( odometer, array_of_arrays ){
    // In Imperative Programmingese (i.e., English):
    // let s_output = "";
    // for( let i=0; i < odometer.length; i++ ){
    //    s_output += "" + array_of_arrays[i][odometer[i]]; 
    // }
    // return s_output;

    // In Functional Programmingese (Henny Youngman one-liner):
    return odometer.reduce(
      function(accumulator, odometer_value, odometer_index){
        return "" + accumulator + array_of_arrays[odometer_index][odometer_value];
      },
      ""
    );
}/* formCombination() */

function odometer_increment( odometer, array_of_arrays ){

    // Basically, work you way from the rightmost digit of the "odometer"...
    // if you're able to increment without cycling that digit back to zero,
    // you're all done, otherwise, cycle that digit to zero and go one digit to the
    // left, and begin again until you're able to increment a digit
    // without cycling it...simple, huh...?

    for( let i_odometer_digit = odometer.length-1; i_odometer_digit >=0; i_odometer_digit-- ){ 

        let maxee = array_of_arrays[i_odometer_digit].length - 1;         

        if( odometer[i_odometer_digit] + 1 <= maxee ){
            // increment, and you're done...
            odometer[i_odometer_digit]++;
            return true;
        }
        else{
            if( i_odometer_digit - 1 < 0 ){
                // No more digits left to increment, end of the line...
                return false;
            }
            else{
                // Can't increment this digit, cycle it to zero and continue
                // the loop to go over to the next digit...
                odometer[i_odometer_digit]=0;
                continue;
            }
        }
    }/* for( let odometer_digit = odometer.length-1; odometer_digit >=0; odometer_digit-- ) */

}/* odometer_increment() */
