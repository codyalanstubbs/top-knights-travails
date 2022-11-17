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
    [-2,-1],
    [-2, 1],
    [ 2,-1],
    [ 2, 1],
    [-1,-2],
    [-1, 2],
    [ 1,-2],
    [ 1, 2]
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

    const getPossiblePositions = () => {return calculateNextMove(currentPosition)};
    
    const getCurrentPosition = () => {return currentPosition};

    const changePosition = (nextPosition) => {currentPosition = nextPosition; return currentPosition};
    
    return { 
        getCurrentPosition, 
        getPossiblePositions, 
        changePosition
    };
};

const newKnight = Knight([0,0]);
console.log(newKnight.getCurrentPosition());
console.log(newKnight.getPossiblePositions());
let nextPosition = newKnight.getPossiblePositions()[0];
console.log(nextPosition);
console.log(newKnight.changePosition(nextPosition));
console.log(newKnight.getCurrentPosition());
console.log(newKnight.getPossiblePositions());