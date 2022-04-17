import "./tic_toc.style.css";
import { customElement } from '../lib/customElement'
import { TicTocModel } from './tic_toc.model'
import { TicTocView } from './tic_toc.view'

// constants
export const ELEMENT_NAME = "tic-toc";

// custom element
export default class TicTocElement extends HTMLElement {
  name = ELEMENT_NAME
  static model = [TicTocModel];
  static view = TicTocView
  static target = ["curPlayer", "msg", "undoBtn", "resetBtn", "cellsWrapper"]

  disconnectedCallback() {
    this.model.ticTocModel.reset();
  }

  // event handlers
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

}

if (!customElements.get(ELEMENT_NAME)) {
  window[ELEMENT_NAME] = TicTocElement
  customElements.define(
    ELEMENT_NAME,
    customElement(TicTocElement)
  )
}
