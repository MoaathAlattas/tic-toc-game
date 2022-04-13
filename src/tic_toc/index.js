import "./style.css";
import { customElement } from '../lib/customElement'
import TicTocModel from './model'
import TicTocView from './view'

// constants
export const ELEMENT_NAME = "tic-toc";

// custom element
export class TicTocElement extends HTMLElement {
  name = ELEMENT_NAME
  _target = ["curPlayer", "msg", "undoBtn", "resetBtn", "cellsWrapper"]
  _targets = ["cells"]

  // setup
  connectedCallback() {
    this.cellsWrapper?.addEventListener('click', this.onCellClick.bind(this))
    this.undoBtn?.addEventListener('click', this.onUndoClick.bind(this))
    this.resetBtn?.addEventListener('click', this.onResetClick.bind(this))
  }

  // event handlers
  onCellClick({ target }) {
    this._model.playOnce(target.dataset.pos);
  }
  onUndoClick() {
    this._model.undo();
  }
  onResetClick() {
    this._model.reset();
  }

  viewPrams() {
    return {
      element: this,
      model: this._model
    }
  }

}

if (!customElements.get(ELEMENT_NAME)) {
  window[ELEMENT_NAME] = TicTocElement
  customElements.define(
    ELEMENT_NAME,
    customElement(TicTocElement, {
      model: [TicTocModel],
      view: TicTocView
    })
  )
}