import "./tic_toc.style.css";
import { customElement } from '../lib/customElement'
import { html } from '../lib/render'
import { TicTocModel } from './tic_toc.model'

// components
import { Cells } from './components/cells'
import { ResultMsg } from './components/result_msg'
import { UndoBtn } from './components/undo_btn'
import { ResetBtn } from './components/reset_btn'

// constants
export const ELEMENT_NAME = "tic-toc";
export const POS_DATA_ATTR = "pos";
export const WIN_DATA_ATTR = "win";
export const WIN_MSG = (winner) => `Congrats Player ${winner}`
export const TIE_MSG = () => `No winner! Reset to play again :)`

// custom element
export default class TicTocElement extends HTMLElement {
  name = ELEMENT_NAME
  static model = [TicTocModel];
  static target = ["curPlayer", "msg", "undoBtn", "resetBtn", "cellsWrapper"]
  // event handlers
  onPlay = ({ target }) => {
    if (target.dataset.pos) {
      this.model.ticTocModel.playOnce(target.dataset.pos)
    }
  }

  onUndo = () => {
    this.model.ticTocModel.undo();
  }

  onReset = () => {
    this.model.ticTocModel.reset();
  }

  get template() {
    const { player, plays, winner, playCount } = this.model.ticTocModel;
    return html`
      <div>
          Current Player: <span .dataset="${{ target: `${ELEMENT_NAME}.curPlayer` }}">${player}</span>
      </div>
      <div class="cells"
            onClick="${this.onPlay}"
            .dataset="${{ target: `${ELEMENT_NAME}.cellsWrapper` }}">
          ${Cells({ plays, POS_DATA_ATTR, WIN_DATA_ATTR })}
      </div>
      <div .dataset="${{ target: `${ELEMENT_NAME}.msg` }}">
          ${ResultMsg({ winner, playCount, WIN_MSG, TIE_MSG })}
      </div>
      <div>
          ${UndoBtn({ playCount, onUndo: this.onUndo, ELEMENT_NAME })}
          ${ResetBtn({ playCount, onReset: this.onReset, ELEMENT_NAME })}
      </div>
      `;
  }

}

if (!customElements.get(ELEMENT_NAME)) {
  window[ELEMENT_NAME] = TicTocElement
  customElements.define(
    ELEMENT_NAME,
    customElement(TicTocElement, { "klb": true })
  )
}
