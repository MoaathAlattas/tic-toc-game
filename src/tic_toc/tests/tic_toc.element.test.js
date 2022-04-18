import TicTocElement from '../tic_toc.element.js'
import {
  DEFAULT_PLAYER, PLAYER, ELEMENT_NAME,
  POS_DATA_ATTR, WIN_DATA_ATTR
} from '../constants.js'

describe.only('TicTocElement', () => {
  let $0;
  let CLICK_EVENT = new Event('click', { bubbles: true })

  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 50));

  const getCellByPos = (position) => $0.querySelector(`[data-${POS_DATA_ATTR}="${position}"]`);
  const playOn = async (positions) => {
    for (const position of positions) {
      getCellByPos(position).dispatchEvent(CLICK_EVENT);
    }
    await flushPromises()
  }

  beforeAll(() => {
    TicTocElement()
  })

  beforeEach(async () => {
    let ticTocElement = document.createElement(ELEMENT_NAME);
    ticTocElement.id = "some-id";
    document.body.appendChild(ticTocElement);
    await flushPromises()
    $0 = document.body.querySelector('#some-id');
  });

  afterEach(async () => {
    document.body.textContent = '';
    await flushPromises()
    $0 = null;
  });

  // happy path
  test("Verify winner render", async () => {
    const plays = [0, 8, 1, 7, 2]
    await playOn(plays)
    expect($0.target.msg.textContent).not.toBe(" ");
    expect(getCellByPos(0).getAttribute(`data-${WIN_DATA_ATTR}`)).toBe("true")
    expect(getCellByPos(1).getAttribute(`data-${WIN_DATA_ATTR}`)).toBe("true")
    expect(getCellByPos(2).getAttribute(`data-${WIN_DATA_ATTR}`)).toBe("true")
    plays.forEach((position) => {
      expect(getCellByPos(position).textContent).not.toBe(null)
    });
  });
  test("Verify tie render", async () => {
    const plays = [0, 8, 1, 7, 3, 6, 4, 5]
    await playOn(plays)
    expect($0.target.msg.textContent).not.toBe("");
    plays.forEach((position) => {
      expect(getCellByPos(position).textContent).not.toBe(null)
    });
  });

  // dom
  test("Verify current player render", () => {
    expect($0.target.curPlayer.textContent).toContain(DEFAULT_PLAYER);
  });
  test("Verify 9 cells render", () => {
    const childrenArr = Array.from($0.target.cellsWrapper.children);
    expect(childrenArr.length).toBe(9);
    childrenArr.forEach((cell) => {
      expect(cell.hasAttribute(`data-${POS_DATA_ATTR}`)).toBe(true);
      expect(cell.textContent.trim()).toBe("");
    });
  });
  test("Verify empty message render", () => {
    expect($0.target.msg.textContent.trim()).toEqual("");
  });

  // events
  test("Verify play render", async () => {
    await playOn([0])
    expect(getCellByPos(0).textContent.trim()).toContain(DEFAULT_PLAYER);
    expect($0.target.curPlayer.textContent.trim()).toContain(PLAYER.TWO);
    expect($0.target.msg.textContent.trim()).toBe("");
  });
  test("Verify undo render", async () => {
    await playOn([0])
    expect(getCellByPos(0).textContent.trim()).not.toBe("");
    $0.target.undoBtn.dispatchEvent(CLICK_EVENT);
    await flushPromises()
    expect(getCellByPos(0).textContent.trim()).toBe("");
  });
  test("Verify reset render", async () => {
    const plays = [0, 2]
    await playOn(plays)
    plays.forEach((pos) => {
      expect(getCellByPos(pos).textContent.trim()).not.toBe("");
    });
    $0.target.resetBtn.dispatchEvent(CLICK_EVENT);
    await flushPromises()
    plays.forEach((pos) => {
      expect(getCellByPos(pos).textContent.trim()).toBe("");
    });
  });

  // edge cases
  test("Verify play once on a cell that is already played", async () => {
    await playOn([0])
    await flushPromises()
    await playOn([0])
    await flushPromises()
    expect(getCellByPos(0).textContent.trim()).toContain(DEFAULT_PLAYER);
  });
  test("Verify undo on an empty stack", async () => {
    $0.target.undoBtn.dispatchEvent(CLICK_EVENT);
    await flushPromises()
    expect($0.target.msg.textContent.trim()).toBe("");
  });
  test("Verify render multiple instances and play", async () => {
    let ticTocElement = document.createElement(ELEMENT_NAME);
    ticTocElement.id = "some-id2";
    document.body.appendChild(ticTocElement);
    await flushPromises()

    const $1 = document.body.querySelector('#some-id2');

    const firstPos0 = $0.querySelector(`[data-${POS_DATA_ATTR}="0"]`)
    const firstPos1 = $0.querySelector(`[data-${POS_DATA_ATTR}="1"]`)
    const secondPos0 = $1.querySelector(`[data-${POS_DATA_ATTR}="0"]`)
    const secondPos1 = $1.querySelector(`[data-${POS_DATA_ATTR}="1"]`)

    $0.onPlay({ target: firstPos0 });
    $1.onPlay({ target: firstPos1 });
    await flushPromises()

    expect(firstPos0.textContent.trim()).toContain(DEFAULT_PLAYER);
    expect(firstPos1.textContent.trim()).toBe("");
    expect(secondPos1.textContent.trim()).toContain(DEFAULT_PLAYER);
    expect(secondPos0.textContent.trim()).toBe("");
  });
});
