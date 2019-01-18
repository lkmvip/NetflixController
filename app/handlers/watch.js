class WatchVideo extends NavigatablePage {
    static validatePath(path) {
        return path.startsWith('/watch')
    }

    async load() {
        await super.load()
        this.player = document.querySelector('.NFPlayer')
    }

    isPageReady() {
        return document.querySelector('.NFPlayer') !== null
    }

    onAction(index) {
        if (index === StandardMapping.Button.BUTTON_BOTTOM) {
            // SPACE/ENTER = play/pause
            this.dispatchKey(32)
        } else if (index === StandardMapping.Button.BUTTON_LEFT) {
            // M = toggle mute
            this.dispatchKey(77)
        } else if (index === StandardMapping.Button.BUTTON_TOP) {
            // F(on)/ESC(off) = toggle fullscreen
            // unable to set fullscreen via key due to non-trusted events; use chrome.debugger
            chrome.runtime.sendMessage({action: 'fullscreen'})
        } else if (index === StandardMapping.Button.D_PAD_LEFT) {
            // LEFT = rewind 10s
            this.dispatchKey(37)
        } else if (index === StandardMapping.Button.D_PAD_RIGHT) {
            // RIGHT = fast forward 10s
            this.dispatchKey(39)
        } else if (index === StandardMapping.Button.D_PAD_UP) {
            // UP = volume up
            this.dispatchKey(38)
        } else if (index === StandardMapping.Button.D_PAD_BOTTOM) {
            // DOWN = volume down
            this.dispatchKey(40)
        } else if (index === StandardMapping.Button.BUMPER_RIGHT) {
            this.openNextEpisode()
        }
    }

    onDirectionAction(direction) {
        // override default direction navigation to do nothing
    }

    openNextEpisode() {
        let button = document.querySelector('.button-nfplayerNextEpisode')
        button.click()
    }

    dispatchKey(keyCode) {
        let event = new KeyboardEvent('keydown', {keyCode: keyCode, bubbles: true, cancelable: true, view: window})
        this.player.dispatchEvent(event)
    }
}