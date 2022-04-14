import { render, html } from '../lib/render'

const POS_DATA_ATTR = "pos";
const WIN_DATA_ATTR = "winCell";

export default class TicTocView {

    constructor({ element, model }) {
        this._element = element
        this._model = model
    }

    resultMsg() {
        let msg = ""
        if (this._model.winner) {
            msg = `Congrats Player ${this._model.winner}`
        } else if (this._model.playCount === 9) {
            msg = `No winner! Reset to play again :)`
        }
        return html`${msg}`;
    }

    cells() {
        const cell = (_, i) => {
            const playObj = this._model.getPlayByPosition(i);
            const value = playObj ? playObj.value : "";
            const winDataAttr = playObj && playObj.win ? true : null;
            return html`
            <div .dataset=${{ [POS_DATA_ATTR]: i, [WIN_DATA_ATTR]: winDataAttr, targets: `${this._element.name}.cells` }}>
                ${value}
            </div>
            `
        }
        return html`${[...new Array(9)].map(cell)}`
    }

    currPlayer() {
        return html`${this._model.player}`
    }

    render() {
        render(this._element.target.msg, this.resultMsg());
        render(this._element.target.cellsWrapper, this.cells());
        render(this._element.target.curPlayer, this.currPlayer());
    }
}