import "./tic_toc.style.css";
import {
  ELEMENT_NAME, POS_DATA_ATTR,
  WIN_DATA_ATTR, WIN_MSG, TIE_MSG
} from './constants'
import { customElement } from '../lib/customElement'
import { html } from '../lib/render'
import { TicTocModel } from './tic_toc.model'

// components
import { Cells } from './components/cells'
import { ResultMsg } from './components/result_msg'
import { UndoBtn } from './components/undo_btn'
import { ResetBtn } from './components/reset_btn'

// custom element
export class TicTocElement extends HTMLElement {
  static model = [TicTocModel];
  static target = ["curPlayer", "msg", "undoBtn", "resetBtn", "cellsWrapper"]

  constructor() {
    super();
    this.onUndo = this.onUndo.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onPlay = this.onPlay.bind(this);
  }

  onPlay({ target }) {
    if (target.dataset.pos) {
      this.model.ticTocModel.playOnce(target.dataset.pos)
    }
  }

  onUndo() {
    this.model.ticTocModel.undo();
  }

  onReset() {
    this.model.ticTocModel.reset();
  }

  get template() {
    const { player, plays, winner, playCount } = this.model.ticTocModel;
    return html`
      <div>
          Current Player: <span .dataset="${{ target: `${this.config.name}.curPlayer` }}">${player}</span>
      </div>
      <div class="cells"
            onClick="${this.onPlay}"
            .dataset="${{ target: `${this.config.name}.cellsWrapper` }}">
          ${Cells({ plays, POS_DATA_ATTR, WIN_DATA_ATTR })}
      </div>
      <div .dataset="${{ target: `${this.config.name}.msg` }}">
          ${ResultMsg({ winner, playCount, WIN_MSG, TIE_MSG })}
      </div>
      <div>
          ${UndoBtn({ playCount, onUndo: this.onUndo, tagName: this.config.name })}
          ${ResetBtn({ playCount, onReset: this.onReset, tagName: this.config.name })}
      </div>
      `;
  }
}

export default customElement(TicTocElement, {
  name: ELEMENT_NAME,
  dataset: {
    pos: POS_DATA_ATTR,
    win: WIN_DATA_ATTR
  },
  text: {
    win: WIN_MSG,
    tie: TIE_MSG
  },
  props: {}
})
