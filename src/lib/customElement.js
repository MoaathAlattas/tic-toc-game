import { bind } from './catalyst'


function debounceRender(element) {
    if (element.debounce) {
        cancelAnimationFrame(element.debounce);
    }
    element.debounce = requestAnimationFrame(() => {
        element.view.render(element, element.model)
    });
};

export function customElement(customElement, props = {}) {
    customElement.prototype.target = {}
    customElement.prototype.targets = {}
    customElement.prototype.model = {}
    customElement.prototype.view = null
    customElement.prototype.props = props
    const connectedCallback = customElement.prototype.connectedCallback
    customElement.prototype.connectedCallback = function () {
        customElements.upgrade(this)
        let _model = {};
        let _view = null;

        // setup view
        if (customElement.view) {
            _view = new customElement.view({ ...this.viewData })
            Object.defineProperty(this, "view", {
                enumerable: true,
                configurable: true,
                get: () => _view
            })
        }

        // setup models
        if (customElement.model) {
            customElement.model.forEach(Model => {
                const modelName = Model.name.charAt(0).toLowerCase() + Model.name.slice(1)
                _model[modelName] = new Proxy(new Model(), {
                    set: (target, name, val) => {
                        target[name] = val
                        this.view && debounceRender(this);
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

        bind(this)
        this.view && debounceRender(this);
        connectedCallback && connectedCallback.call(this)
    }

    const render = customElement.prototype.render
    customElement.prototype.render = function () {
        render && render()
        _view && debounceRender(this)
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
    constructor(viewData) {
        Object.assign(this, viewData)
    }
}