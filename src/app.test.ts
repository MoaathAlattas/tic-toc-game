/**
 * @jest-environment jsdom
 */

const ELEMENT_NAME = "test-component";

customElements.define(
  ELEMENT_NAME,
  class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = "It works!";
    }
  }
);

test("custom elements in JSDOM", () => {
  document.body.innerHTML = `<${ELEMENT_NAME}></${ELEMENT_NAME}>`;
  expect(document.body.innerHTML).toContain("It works!");
});
