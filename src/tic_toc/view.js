import { render as renderer, html } from "uhtml";
const POS_DATA_ATTR = "pos";
const WIN_DATA_ATTR = "winCell";

function render(target, content) {
    target && renderer(target, content)
}

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
        return render(this._element.msg, html`${msg}`);
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
        return render(this._element.cellsWrapper, html`${[...new Array(9)].map(cell)}`);
    }

    currPlayer() {
        return render(this._element.curPlayer, html`${this._model.player}`)
    }

    render() {
        this.cells();
        this.resultMsg();
        this.currPlayer();
    }
}