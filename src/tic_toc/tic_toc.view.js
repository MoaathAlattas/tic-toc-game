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

    undoBtn({ playCount }) {
        const canUndo = playCount > 0;
        return html`
        <button data-target="tic-toc.undoBtn"
                data-action="click:tic-toc#onUndo"
                .disabled=${!canUndo}>Undo</button>`
    }

    resetBtn({ playCount }) {
        const canUndo = playCount > 0;
        return html`
        <button data-target="tic-toc.resetBtn"
                data-action="click:tic-toc#onReset"
                .disabled=${!canUndo}>Reset</button>`
    }

    template({ tagName, player, playCount, getPlayByPosition, winner }) {
        return html`
            <div>
                Current Player: <span .dataset="${{ target: `${tagName}.curPlayer` }}">${this.currPlayer({ player })}</span>
            </div>
            <div class="cells"
                .dataset="${{
                target: `${tagName}.cellsWrapper`,
                action: `click:${tagName}#onPlay`
            }}">
                ${this.cells({ getPlayByPosition })}
            </div>
            <div .dataset="${{ target: `${tagName}.msg` }}">
                ${this.resultMsg({ winner, playCount })}
            </div>
            <div>
                ${this.undoBtn({ playCount })}
                ${this.resetBtn({ playCount })}
            </div>
        `
    }

    render(element, model) {
        const { player, playCount, winner } = model.ticTocModel;
        const getPlayByPosition = model.ticTocModel.getPlayByPosition.bind(model.ticTocModel);
        const tagName = element.tagName.toLowerCase();
        render(element, this.template({
            tagName,
            player,
            playCount,
            getPlayByPosition,
            winner
        }));
    }
}