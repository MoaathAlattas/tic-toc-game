import { render, html } from '../lib/render'
import { BaseView } from '../lib/customElement'

export const POS_DATA_ATTR = "pos";
export const WIN_DATA_ATTR = "win";
export const WIN_MSG = (winner) => `Congrats Player ${winner}`
export const TIE_MSG = () => `No winner! Reset to play again :)`

export class TicTocView extends BaseView {

    resultMsg({ winner, playCount }) {
        if (winner) {
            return html`${WIN_MSG(winner)}`
        } else if (playCount === 9) {
            return html`${TIE_MSG()}`
        }
        return html``;
    }

    cells({ getPlayByPosition }) {
        const cell = (_, i) => {
            const playObj = getPlayByPosition(i);
            const value = playObj ? playObj.value : "";
            const winDataAttr = playObj && playObj.win ? true : null;
            return html`
                <div .dataset=${{
                    [POS_DATA_ATTR]: i,
                    [WIN_DATA_ATTR]: winDataAttr
                }}>
                    ${value}
                </div>
            `
        }
        return html`${[...new Array(9)].map(cell)}`
    }

    currPlayer({ player }) {
        return html`${player}`
    }

    render() {
        render(this.element.target.msg, this.resultMsg({
            winner: this.model.ticTocModel.winner,
            playCount: this.model.ticTocModel.playCount
        }));

        render(this.element.target.cellsWrapper, this.cells({
            getPlayByPosition: this.model.ticTocModel.getPlayByPosition.bind(this.model.ticTocModel)
        }));

        render(this.element.target.curPlayer, this.currPlayer({
            player: this.model.ticTocModel.player
        }));
    }
}