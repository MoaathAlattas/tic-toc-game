import { render, html } from '../lib/render'
import { BaseView } from '../lib/customElement'
import { Cells } from './components/cells'
import { ResultMsg } from './components/result_msg'
import { UndoBtn } from './components/undo_btn'
import { ResetBtn } from './components/reset_btn'

export const POS_DATA_ATTR = "pos";
export const WIN_DATA_ATTR = "win";
export const WIN_MSG = (winner) => `Congrats Player ${winner}`
export const TIE_MSG = () => `No winner! Reset to play again :)`

export class TicTocView extends BaseView {

    render(element, props) {
        const { player, plays, winner, playCount } = props;
        const tagName = element.tagName.toLowerCase();
        render(element, html`
            <div>
                Current Player: <span .dataset="${{ target: `${tagName}.curPlayer` }}">${player}</span>
            </div>
            <div class="cells"
                 onClick="${element.onPlay}"
                 .dataset="${{ target: `${tagName}.cellsWrapper` }}">
                ${Cells({ plays, POS_DATA_ATTR, WIN_DATA_ATTR })}
            </div>
            <div .dataset="${{ target: `${tagName}.msg` }}">
                ${ResultMsg({ winner, playCount, WIN_MSG, TIE_MSG })}
            </div>
            <div>
                ${UndoBtn({ playCount, onUndo: element.onUndo, tagName })}
                ${ResetBtn({ playCount, onReset: element.onReset, tagName })}
            </div>
        `);
    }
}