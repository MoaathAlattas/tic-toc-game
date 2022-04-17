import { TicTocView, WIN_MSG, TIE_MSG, WIN_DATA_ATTR, POS_DATA_ATTR } from '../tic_toc.view.js'
import { render } from '../../lib/render.js'

let ticTocView;
let div = document.createElement('div')
describe('TicTocView', () => {

  beforeAll(() => {
    ticTocView = new TicTocView()
  })

  beforeEach(() => {
    div.innerHTML = ''
  })

  // resultMsg
  test("Verify winner message", () => {
    const winner = 'X'
    const resultMsg = ticTocView.resultMsg({ winner })
    render(document.body, resultMsg)
    expect(document.body.innerHTML).toContain(WIN_MSG(winner));
  });
  test("Verify tie message", () => {
    const resultMsg = ticTocView.resultMsg({ winner: "", "playCount": 9 })
    render(document.body, resultMsg)
    expect(document.body.innerHTML).toContain(TIE_MSG());
  });
  test("Verify no message", () => {
    const resultMsg = ticTocView.resultMsg({ winner: "", "playCount": 8 })
    render(document.body, resultMsg)
    expect(document.body.textContent.trim()).toBe("");
  });

  // cells
  test("Verify 9 cells rendered with position attribute", () => {
    const cells = ticTocView.cells({ getPlayByPosition: () => null })
    render(document.body, cells)
    const divs = document.body.querySelectorAll(`div[data-${POS_DATA_ATTR}]`)
    expect(divs.length).toBe(9);
  })

  test("Verify cells render value", () => {
    const value = 'YA WLD'
    const cells = ticTocView.cells({ getPlayByPosition: () => ({ value }) })
    render(document.body, cells)
    const divs = document.body.querySelectorAll(`div[data-${POS_DATA_ATTR}]`)
    divs.forEach(div => {
      expect(div.innerHTML).toContain(value);
    })
  })
  test("Verify cells doesn't render value", () => {
    const value = ""
    const cells = ticTocView.cells({ getPlayByPosition: () => ({ value }) })
    render(document.body, cells)
    const divs = document.body.querySelectorAll(`div[data-${POS_DATA_ATTR}]`)
    divs.forEach(div => {
      expect(div.textContent.trim()).toContain(value);
    })
  })
  test("Verify cells render win data attr", () => {
    const win = true
    const cells = ticTocView.cells({ getPlayByPosition: () => ({ win }) })
    render(document.body, cells)
    const divs = document.body.querySelectorAll(`div[data-${WIN_DATA_ATTR}]`)
    divs.forEach(div => {
      expect(div.dataset[WIN_DATA_ATTR]).toBe("true");
    })
  });
  test("Verify cells doesn't render win data attr", () => {
    const win = false
    const cells = ticTocView.cells({ getPlayByPosition: () => ({ win }) })
    render(document.body, cells)
    const divs = document.body.querySelectorAll(`div[data-${WIN_DATA_ATTR}]`)
    divs.forEach(div => {
      expect(div.dataset[WIN_DATA_ATTR]).toBe(undefined);
    })
  });

  // currPlayer
  test("Verify currPlayer renders value", () => {
    const player = 'XYZ'
    const currPlayer = ticTocView.currPlayer({ player })
    render(document.body, currPlayer)
    expect(document.body.innerHTML).toContain(player);
  })
})

