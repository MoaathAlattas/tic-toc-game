import TicTocView from '../tic_toc.view.js'
import { render } from '../../lib/render.js'
test("TicTocView init test", () => {
  const ticTocView = new TicTocView()
  render(document.body, ticTocView.resultMsg({ "winner": "xyz" }))
  expect(document.body.innerHTML).toContain("Congrats Player xyz");
});