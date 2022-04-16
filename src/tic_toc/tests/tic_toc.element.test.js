import userEvent from '@testing-library/user-event/dist/index.mjs';
import { ELEMENT_NAME } from '../tic_toc.element.js'
import { DEFAULT_PLAYER, PLAYER } from '../tic_toc.model.js'
import { POS_DATA_ATTR, WIN_DATA_ATTR } from '../tic_toc.view.js'
import '../tic_toc.element.js'

describe('TicTocElement', () => {
  let ticTocElement;
  let $0;

  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 100));

  const getCellByPos = (position) => $0.querySelector(`[data-${POS_DATA_ATTR}="${position}"]`);
  const playOn = async (positions) => {
    for (const position of positions) {
      const cell = getCellByPos(position);
      await userEvent.click(cell)
    }
    await flushPromises()
  }
  const cleanUpContent = (str) => {
    return str.replace('<!--isµ1-->', '').replace(/^(&nbsp;|\s)*/, '')
  };

  // Render to dom: cells, winner message, current player
  // Events: play once, undo, reset
  // happy path: win, no win, tie
  // sad path: invalid play
  // edge cases:
  //   - play once on a cell that is already played
  //   - undo on an empty stack
  //   - reset
  //   - play once on an empty cell
  //   - play once on a cell that is already played
  beforeEach(() => {
    ticTocElement = document.createElement(ELEMENT_NAME);
    ticTocElement.innerHTML = `
      <${ELEMENT_NAME}>
        <span data-target="${ELEMENT_NAME}.curPlayer">X</span>
        <div data-target="${ELEMENT_NAME}.cellsWrapper"
             data-action="click:${ELEMENT_NAME}#onPlay"></div>
        <div data-target="${ELEMENT_NAME}.msg"></div>
        <div>
          <button data-target="${ELEMENT_NAME}.undoBtn"
                  data-action="click:${ELEMENT_NAME}#onUndo">Undo</button>
          <button data-target="${ELEMENT_NAME}.resetBtn"
                  data-action="click:${ELEMENT_NAME}#onReset">Reset</button>
        </div>
      </${ELEMENT_NAME}>
    `;
    document.body.appendChild(ticTocElement);
    $0 = document.body.querySelector(ELEMENT_NAME);
  });

  // happy path
  test("Verify winner render", async () => {
    const plays = [0, 8, 1, 7, 2]
    await playOn(plays)
    expect($0.target.msg.innerHTML).not.toBe("");
    expect(getCellByPos(0).getAttribute(`data-${WIN_DATA_ATTR}`)).toBe("true")
    expect(getCellByPos(1).getAttribute(`data-${WIN_DATA_ATTR}`)).toBe("true")
    expect(getCellByPos(2).getAttribute(`data-${WIN_DATA_ATTR}`)).toBe("true")
    plays.forEach((position) => {
      expect(getCellByPos(position).innerHTML).not.toBe(null)
    });
  });
  test("Verify tie render", async () => {
    const plays = [0, 8, 1, 7, 3, 6, 4, 5]
    await playOn(plays)
    expect($0.target.msg.innerHTML).not.toBe("");
    plays.forEach((position) => {
      expect(getCellByPos(position).innerHTML).not.toBe(null)
    });
  });

  // dom
  test("Verify current player render", () => {
    expect($0.target.curPlayer.innerHTML).toContain(DEFAULT_PLAYER);
  });
  test("Verify 9 cells render", () => {
    const childrenArr = Array.from($0.target.cellsWrapper.children);
    expect(childrenArr.length).toBe(9);
    childrenArr.forEach((cell) => {
      expect(cell.hasAttribute(`data-${POS_DATA_ATTR}`)).toBe(true);
      const cellContent = cleanUpContent(cell.innerHTML);
      expect(cellContent).toBe("");
    });
  });
  test("Verify empty message render", () => {
    expect($0.target.msg.innerHTML).toBe("");
  });

  // events
  test("Verify play render", async () => {
    await playOn([0])
    expect(getCellByPos(0).innerHTML).toContain(DEFAULT_PLAYER);
    expect($0.target.curPlayer.innerHTML).toContain(PLAYER.TWO);
    expect($0.target.msg.innerHTML).toBe("");
  });
  test("Verify undo render", async () => {
    await playOn([0])
    expect(cleanUpContent(getCellByPos(0).innerHTML)).not.toBe("");
    await userEvent.click($0.target.undoBtn)
    await flushPromises()
    expect(cleanUpContent(getCellByPos(0).innerHTML)).toBe("");
  });
  test("Verify reset render", async () => {
    const plays = [0, 2]
    await playOn(plays)
    plays.forEach((pos) => {
      expect(cleanUpContent(getCellByPos(pos).innerHTML)).not.toBe("");
    });
    await userEvent.click($0.target.resetBtn)
    await flushPromises()
    plays.forEach((pos) => {
      expect(cleanUpContent(getCellByPos(pos).innerHTML)).toBe("");
    });
  });

  // edge cases
  test("Verify play once on a cell that is already played", async () => {
    await playOn([0])
    await userEvent.click(getCellByPos(0))
    await flushPromises()
    await userEvent.click(getCellByPos(0))
    await flushPromises()
    expect(cleanUpContent(getCellByPos(0).innerHTML)).toContain(DEFAULT_PLAYER);
  });
  test("Verify undo on an empty stack", async () => {
    await userEvent.click($0.target.undoBtn)
    await flushPromises()
    expect($0.target.msg.innerHTML).toBe("");
  });
});
