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
    const { name, dataset, text } = this.config;
    return html`
      <div>
          Current Player: <span .dataset="${{ target: `${name}.curPlayer` }}">${player}</span>
      </div>
      <div class="cells"
           onClick="${this.onPlay}"
           .dataset="${{ target: `${name}.cellsWrapper` }}">
          ${Cells({ plays, dataset })}
      </div>
      <div .dataset="${{ target: `${name}.msg` }}">
          ${ResultMsg({ winner, playCount, text })}
      </div>
      <div>
          ${UndoBtn({ playCount, onUndo: this.onUndo, tagName: name })}
          ${ResetBtn({ playCount, onReset: this.onReset, tagName: name })}
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
