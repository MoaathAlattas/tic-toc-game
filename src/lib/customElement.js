export function customElement(customElement, { model, view }) {
    let _view;

    const render = customElement.prototype.render
    customElement.prototype.render = function () {
        render && render()
        _view && _view.render()
    }

    const connectedCallback = customElement.prototype.connectedCallback
    customElement.prototype.connectedCallback = function () {

        // model
        let __model;
        // { "modelName" : model}
        if (model.length > 0) { }

        const _model = model ? new Proxy(new model[0](), {
            set: (target, name, val) => {
                target[name] = val
                this.render();
                return true
            }
        }) : null;

        Object.defineProperty(this, "_model", {
            get: () => _model
        })

        // setup the view
        if (view && !_view) {
            _view = new view(this.viewPrams())
        }

        // Target
        this._target && this._target.map(targetName => {
            Object.defineProperty(this, targetName, {
                get: () => {
                    return findTarget(this, targetName)
                }
            })
        })

        // Targets
        this._target && this._targets.map(targetsName => {
            Object.defineProperty(this, targetsName, {
                get: () => {
                    return findTargets(this, targetsName)
                }
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