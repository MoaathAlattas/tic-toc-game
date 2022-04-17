import { bind } from './catalyst'
import { render, html } from './render'


function debounceRender(element) {
    if (element.debounce) {
        cancelAnimationFrame(element.debounce);
    }
    element.debounce = requestAnimationFrame(() => element.render());
};

export function customElement(customElement, props = {}) {
    customElement.prototype.target = {}
    customElement.prototype.targets = {}
    customElement.prototype.model = {}

    customElement.prototype.render = function () {
        this.template && render(this, this.template);
    }

    const connectedCallback = customElement.prototype.connectedCallback
    customElement.prototype.connectedCallback = function () {
        customElements.upgrade(this)
        let _model = {};

        // setup models
        if (customElement.model) {
            customElement.model.forEach(Model => {
                const modelName = Model.name.charAt(0).toLowerCase() + Model.name.slice(1)
                _model[modelName] = new Proxy(new Model(), {
                    set: (target, name, val) => {
                        target[name] = val
                        this.render && debounceRender(this);
                        return true
                    }
                })
            })
            Object.defineProperty(this, "model", {
                enumerable: true,
                configurable: true,
                get: () => _model
            })
        }

        // Target
        if (customElement.target) {
            customElement.target.map(targetName => {
                Object.defineProperty(this.target, targetName, {
                    enumerable: true,
                    configurable: true,
                    get: () => findTarget(this, targetName)
                })
            })
        }

        // Targets
        if (customElement.targets) {
            customElement.targets.map(targetsName => {
                Object.defineProperty(this.targets, targetsName, {
                    enumerable: true,
                    configurable: true,
                    get: () => findTargets(this, targetsName)
                })
            })
        }
        this.render && debounceRender(this);
        bind(this)
        connectedCallback && connectedCallback.call(this)
    }

    return customElement
}

export function findTarget(element, name) {
    for (const el of element.querySelectorAll(`[data-target~="${element.name}.${name}"]`)) {
        if (el.closest(element.name) === element) return el
    }
}

export function findTargets(element, name) {
    return element.querySelectorAll(`[data-target="${element.name}.${name}"]`)
}

export class BaseView {
    constructor(element, props) {
        this.element = element
        this.props = props
    }
}