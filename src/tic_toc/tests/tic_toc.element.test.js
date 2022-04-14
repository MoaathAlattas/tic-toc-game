
import { ELEMENT_NAME } from '../tic_toc.element.js'
import '../tic_toc.element.js'

test("custom elements in JSDOM", () => {
  document.body.innerHTML = `
    <${ELEMENT_NAME}>
      <span data-target="${ELEMENT_NAME}.curPlayer"></span>
    </${ELEMENT_NAME}>
  `;
  expect(document.body.innerHTML).toContain("X");
});
