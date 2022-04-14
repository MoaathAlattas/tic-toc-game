function debounceRender(instance) {
    if (instance.debounce) {
        cancelAnimationFrame(instance.debounce);
    }
    instance.debounce = requestAnimationFrame(() => { instance.render() });
};

export function customElement(customElement) {
    let _view = null;
    let _model = {};

    customElement.prototype.target = {}
    customElement.prototype.targets = {}
    customElement.prototype.model = _model

    const render = customElement.prototype.render
    customElement.prototype.render = function () {
        render && render()
        _view && debounceRender(_view)
    }

    const connectedCallback = customElement.prototype.connectedCallback
    customElement.prototype.connectedCallback = function () {

        // setup models
        if (customElement.model.length > 0) {
            customElement.model.forEach(Model => {
                const modelName = Model.name.charAt(0).toLowerCase() + Model.name.slice(1)
                _model[modelName] = new Proxy(new Model(), {
                    set: (target, name, val) => {
                        target[name] = val
                        debounceRender(this);
                        return true
                    }
                })
            })
            Object.defineProperty(this, "model", {
                enumerable: true,
                get: () => _model
            })
        }

        // setup view
        if (customElement.view && !_view) {
            _view = new customElement.view({ model: _model, element: this, ...this.viewData })
            // Object.defineProperty(this, "view", {
            //     get: () => _view
            // })
        }

        // Target
        customElement.target && customElement.target.map(targetName => {
            Object.defineProperty(this.target, targetName, {
                enumerable: true,
                get: () => findTarget(this, targetName)
            })
        })

        // Targets
        customElement.target && customElement.targets.map(targetsName => {
            Object.defineProperty(this.targets, targetsName, {
                enumerable: true,
                get: () => findTargets(this, targetsName)
            })
        })
        _view.render();
        connectedCallback && connectedCallback.call(this)
    }

    return customElement
}

export function findTarget(element, name) {
    return element.querySelector(`[data-target="${element.name}.${name}"]`)
}

export function findTargets(element, name) {
    return element.querySelectorAll(`[data-target="${element.name}.${name}"]`)
}

export class BaseView {
    constructor(viewData) {
        Object.assign(this, viewData)
    }
}