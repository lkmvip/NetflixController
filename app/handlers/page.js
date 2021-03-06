class NavigatablePage {
    constructor() {
        if (new.target === NavigatablePage) {
            throw new TypeError('cannot instantiate abstract NavigatablePage')
        }
        this.navigatables = {}
        this.unloaded = false
    }

    async load() {
        await Promise.all([this.loadPseudoStyler(), this.waitUntilReady()])
        if (!this.unloaded) {
            this.onLoad()
        }
    }

    // to be implemented by subclass
    onLoad() {

    }

    async loadPseudoStyler() {
        if (this.needsPseudoStyler()) {
            this.styler = new PseudoStyler()
            return this.styler.loadDocumentStyles()
        }
        return Promise.resolve()
    }

    // via https://stackoverflow.com/a/30506051/1247781
    waitUntilReady() {
        let _this = this
        return new Promise((resolve, reject) => {
            (function checkReadiness() {
                if (_this.unloaded || _this.isPageReady()) {
                    return resolve()
                }
                setTimeout(checkReadiness, 50)
            })()
        })
    }

    // to be overriden by subclasses
    unload() {
        Object.keys(this.navigatables).forEach(key => this.navigatables[key].exit())
        this.unloaded = true
    }

    // to be overriden by subclasses
    isPageReady() {
        return true
    }

    // to be overriden by subclasses
    needsPseudoStyler() {
        return false
    }

    // to be overriden by subclasses
    hasSearchBar() {
        return false
    }

    // static validatePath(path) must be implemented by subclasses

    isNavigatable(position) {
        return position in this.navigatables
    }

    setNavigatable(position) {
        if (!this.isNavigatable(position)) {
            throw new Error('no navigatable at position ' + position)
        }
        let params = this.exit()
        this.navigatables[position].enter(params)
        this.position = position
    }

    addNavigatable(position, navigatable) {
        if (this.styler) {
            navigatable.styler = this.styler
        }
        this.navigatables[position] = navigatable
    }

    exit() {
        let params = {}
        if (this.navigatables[this.position]) {
            let exitParams = this.navigatables[this.position].exit()
            if (exitParams) {
                params = exitParams
            }
        }
        return params
    }

    enter(params) {
        if (this.navigatables[this.position]) {
            this.navigatables[this.position].enter(params)
        }
    }

    onAction(index) {
        this.navigatables[this.position].doAction(index)
    }

    onDirectionAction(direction) {
        if (direction === DIRECTION.UP) {
            if (this.position > 0) {
                this.setNavigatable(this.position - 1)
            }
        } else if (direction === DIRECTION.DOWN) {
            this.setNavigatable(this.position + 1)
        } else if (direction === DIRECTION.LEFT) {
            this.navigatables[this.position].left()
        } else if (direction === DIRECTION.RIGHT) {
            this.navigatables[this.position].right()
        }
    }
}