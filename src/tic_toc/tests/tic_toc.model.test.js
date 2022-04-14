
import TicTocModel from '../tic_toc.model.js'
test("TicTocModel init test", () => {
  const ticTocModel = new TicTocModel()
  expect(ticTocModel.player).toContain("X");
});
