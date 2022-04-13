import { render, html } from "uhtml";
import "./style.css";
import Model from './model'

// constants
export const ELEMENT_NAME = "tic-toc";
const POS_DATA_ATTR = "pos";
const WIN_DATA_ATTR = "winCell";

// html partials
const resultMsg = (state) => {
  if (state.winner) return html`Congrats Player ${state.winner}`;
  if (state.playCount === 9) return html`No winner! Reset to play again :)`;
  return html``;
}
const cells = (state) => [...new Array(9)].map((_, i) => {
  const playObj = state.getPlayByPosition(i);
  const value = playObj ? playObj.value : "";
  const winDataAttr = playObj && playObj.win ? true : null;
  return html`
    <div .dataset=${{ [POS_DATA_ATTR]: i, [WIN_DATA_ATTR]: winDataAttr, targets: `${ELEMENT_NAME}.cells` }}>
      ${value}
    </div>
  `;
});

// custom element
export class TicTocElement extends HTMLElement {
  #model = new Model();

  connectedCallback() {
    this.eventListeners();
    this.render();
  }

  eventListeners() {
    this.cellsWrapper?.addEventListener('click', this.onCellClick.bind(this))
    this.undoBtn?.addEventListener('click', this.onUndoClick.bind(this))
    this.resetBtn?.addEventListener('click', this.onResetClick.bind(this))
  }

  get state() {
    return this.#model;
  }
  get curPlayer() {
    return this.querySelector(`[data-target="${ELEMENT_NAME}.curPlayer"]`)
  }
  get msg() {
    return this.querySelector(`[data-target="${ELEMENT_NAME}.msg"]`)
  }
  get undoBtn() {
    return this.querySelector(`[data-target="${ELEMENT_NAME}.undoBtn"]`)
  }
  get resetBtn() {
    return this.querySelector(`[data-target="${ELEMENT_NAME}.resetBtn"]`)
  }
  get cellsWrapper() {
    return this.querySelector(`[data-target="${ELEMENT_NAME}.cellsWrapper"]`)
  }
  get cells() {
    return this.querySelectorAll(`[data-target="${ELEMENT_NAME}.cells"]`)
  }

  onCellClick({ target }) {
    this.state.playOnce(target.dataset.pos);
    this.render();
  }

  onUndoClick() {
    this.state.undo();
    this.render();
  }

  onResetClick() {
    this.state.reset();
    this.render();
  }

  render() {
    this.cellsWrapper && render(this.cellsWrapper, html`${cells(this.state)}`);
    this.msg && render(this.msg, resultMsg(this.state));
    this.curPlayer && render(this.curPlayer, html`${this.state.player}`);
  }
}

if (!customElements.get(ELEMENT_NAME)) customElements.define(ELEMENT_NAME, TicTocElement);