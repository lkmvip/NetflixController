class Menu extends Navigatable {
    constructor() {
        super()
        this.options = document.querySelectorAll('li.navigation-tab a')
        this.position = -1
    }

    left() {
        if (this.position > 0) {
            this.select(this.position - 1)
        }
    }

    right() {
        if (this.position < this.options.length - 1) {
            this.select(this.position + 1)
        }
    }

    enter(params) {
        this.select(0)
    }

    exit() {
        this.unselect()
        this.position = -1
    }

    doAction(index) {
        if (index === StandardMapping.Button.BUTTON_BOTTOM) {
            this.options[this.position].click()
            this.unselect()
        }
    }

    unselect() {
        if (this.position >= 0) {
            this.styler.toggleStyle(this.options[this.position], ':hover')
            this.options[this.position].style.outline = '0'
        }
    }

    select(position) {
        this.unselect()
        this.position = position
        this.styler.toggleStyle(this.options[this.position], ':hover')
        this.options[this.position].style.cssText = 'outline: 3px solid ' + getTransparentNetflixRed(0.7) + ' !important'
        Navigatable.scrollIntoView(this.options[this.position])
    }
}