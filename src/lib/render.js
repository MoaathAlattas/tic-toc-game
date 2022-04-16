import { render as renderer } from "uhtml";

export function render(target, content) {
    if (target) renderer(target, content);
}

export { html } from "uhtml"