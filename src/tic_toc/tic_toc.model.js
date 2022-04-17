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

export class TicTocModel {
    player = DEFAULT_PLAYER;
    winner = "";
    plays = []; // {value: "", position: 0, win: false}

    undo() {
        if (this.playCount === 0) return;

        if (this.winner !== "") {
            this.plays.forEach((play) => {
                play.win = false;
            });
        }
        const lastPlay = this.plays[this.plays.length - 1];
        this.plays.pop();

        this.player = lastPlay.value;
        this.winner = "";
    }
    reset() {
        Object.assign(this, new TicTocModel());
    }
    setWinner() {
        const winCondition = this.checkWinner();
        this.plays.forEach((play) => {
            if (winCondition.includes(play.position)) {
                play.win = true;
            }
        });
        this.winner = winCondition.length > 0 ? this.player : "";
    }
    switchPlayer() {
        this.player = this.nextPlayer();
    }
    canPlay(position) {
        const alreadyPlayed = this.getPlayByPosition(position);
        return position < 9 && !alreadyPlayed && this.winner === "";
    }
    getPlayByPosition(position) {
        return this.plays.find((play) => play.position === parseInt(position, 10));
    }

    playOnce(position) {
        if (!this.canPlay(position)) return;

        this.plays = [...this.plays, {
            value: this.player,
            position: parseInt(position, 10),
            win: false
        }];

        if (this.checkWinner().length > 0) this.setWinner();

        if (!this.isDone()) this.switchPlayer();
    }

    get playCount() {
        return this.plays.length;
    }
    get valuesByPosition() {
        return this.plays.reduce((acc, play, i) => {
            acc[play.position] = play.value;
            return acc;
        }, {});
    }
    nextPlayer() {
        return this.player === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE;
    }
    isDone() {
        return this.playCount === 9 || this.winner !== "";
    }
    checkWinner() {
        const winCondition = WINNING_CONDITIONS.find((condition) => {
            const a = this.valuesByPosition[condition[0]];
            const b = this.valuesByPosition[condition[1]];
            const c = this.valuesByPosition[condition[2]];

            if (!a || !b || !c) return false;

            return a === b && b === c;
        });

        return winCondition || [];
    }
}