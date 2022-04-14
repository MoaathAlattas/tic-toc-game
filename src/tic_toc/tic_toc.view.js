import { render, html } from '../lib/render'
import { BaseView } from '../lib/customElement'

const POS_DATA_ATTR = "pos";
const WIN_DATA_ATTR = "winCell";

export default class TicTocView extends BaseView {

    resultMsg({ winner, playCount }) {
        if (winner) {
            return html`Congrats Player ${winner}`
        } else if (playCount === 9) {
            return html`No winner! Reset to play again :)`
        }
        return html``;
    }

    cells({ getPlayByPosition, name }) {
        const cell = (_, i) => {
            const playObj = getPlayByPosition(i);
            const value = playObj ? playObj.value : "";
            const winDataAttr = playObj && playObj.win ? true : null;
            return html`
            <div .dataset=${{ [POS_DATA_ATTR]: i, [WIN_DATA_ATTR]: winDataAttr, targets: `${name}.cells` }}>
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
            getPlayByPosition: this.model.ticTocModel.getPlayByPosition.bind(this.model.ticTocModel),
            name: this.element.name
        }));

        render(this.element.target.curPlayer, this.currPlayer({
            player: this.model.ticTocModel.player
        }));
    }
}