import { render, html } from "uhtml";
import "./style.css";
import Model from './model'

// constants
export const ELEMENT_NAME = "tic-toc";
const POS_DATA_ATTR = "pos";
const WIN_DATA_ATTR = "winCell";

// html partials
const renderResultMsg = (target, { winner, playCount }) => {
  if (winner) return html`Congrats Player ${winner}`;
  if (playCount === 9) return html`No winner! Reset to play again :)`;
  return target && render(target, html``);
}
const renderCells = (target, model) => {
  const cell = (_, i) => {
    const playObj = model.getPlayByPosition(i);
    const value = playObj ? playObj.value : "";
    const winDataAttr = playObj && playObj.win ? true : null;
    return html`
      <div .dataset=${{ [POS_DATA_ATTR]: i, [WIN_DATA_ATTR]: winDataAttr, targets: `${ELEMENT_NAME}.cells` }}>
        ${value}
      </div>
    `
  }
  return target && render(target, html`${[...new Array(9)].map(cell)}`);
}
const renderCurrPlayer = (target, { player }) => {
  return target && render(target, html`${player}`)
}

// custom element
export class TicTocElement extends HTMLElement {
  #model = new Model();

  // setup
  connectedCallback() {
    this.setupListeners();
    this.render();
  }
  setupListeners() {
    this.cellsWrapper?.addEventListener('click', this.onCellClick.bind(this))
    this.undoBtn?.addEventListener('click', this.onUndoClick.bind(this))
    this.resetBtn?.addEventListener('click', this.onResetClick.bind(this))
  }

  // event handlers
  onCellClick({ target }) {
    this.#model.playOnce(target.dataset.pos);
    this.render();
  }
  onUndoClick() {
    this.#model.undo();
    this.render();
  }
  onResetClick() {
    this.#model.reset();
    this.render();
  }

  // dom changes
  render() {
    renderCells(this.cellsWrapper, this.#model);
    renderResultMsg(this.msg, this.#model)
    renderCurrPlayer(this.curPlayer, this.#model)
  }

  // targets
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
}

if (!customElements.get(ELEMENT_NAME)) customElements.define(ELEMENT_NAME, TicTocElement);