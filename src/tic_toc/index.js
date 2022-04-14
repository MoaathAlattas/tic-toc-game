import "./style.css";
import { customElement } from '../lib/customElement'
import TicTocModel from './model'
import TicTocView from './view'

// constants
export const ELEMENT_NAME = "tic-toc";

// custom element
export class TicTocElement extends HTMLElement {
  name = ELEMENT_NAME
  static model = [TicTocModel];
  static view = TicTocView
  static target = ["curPlayer", "msg", "undoBtn", "resetBtn", "cellsWrapper"]
  static targets = ["cells"]
  get viewData() {
    return {
      element: this,
      model: this.model.ticTocModel
    }
  }

  // setup
  connectedCallback() {
    this.target.cellsWrapper?.addEventListener('click', this.onCellClick.bind(this))
    this.target.undoBtn?.addEventListener('click', this.onUndoClick.bind(this))
    this.target.resetBtn?.addEventListener('click', this.onResetClick.bind(this))
  }

  // event handlers
  onCellClick({ target }) {
    if (target.dataset.pos) {
      this.model.ticTocModel.playOnce(target.dataset.pos)
      this.render()
    }
  }
  onUndoClick() {
    this.model.ticTocModel.undo();
    this.render()
  }
  onResetClick() {
    this.model.ticTocModel.reset();
    this.render()
  }

}

if (!customElements.get(ELEMENT_NAME)) {
  window[ELEMENT_NAME] = TicTocElement
  customElements.define(
    ELEMENT_NAME,
    customElement(TicTocElement)
  )
}