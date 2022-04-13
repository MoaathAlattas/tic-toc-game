
import { ELEMENT_NAME } from './index.js'
import './index.js'

test("custom elements in JSDOM", () => {
  document.body.innerHTML = `
    <${ELEMENT_NAME}>
      <span data-target="${ELEMENT_NAME}.curPlayer"></span>
    </${ELEMENT_NAME}>
  `;
  expect(document.body.innerHTML).toContain("X");
});
