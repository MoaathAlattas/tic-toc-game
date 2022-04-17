// global config
export const ELEMENT_NAME = "tic-toc";
export const POS_DATA_ATTR = "pos";
export const WIN_DATA_ATTR = "win";

// texts
export const WIN_MSG = (winner) => `Congrats Player ${winner}`
export const TIE_MSG = () => `No winner! Reset to play again :)`

// model
export const WINNING_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
export const PLAYER = {
    ONE: "X",
    TWO: "O"
};
export const DEFAULT_PLAYER = PLAYER.ONE;