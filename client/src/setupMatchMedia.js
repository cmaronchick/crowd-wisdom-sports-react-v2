const setupMatchMedia = () => {
    if (typeof window === 'undefined' || window.matchMedia) {
        return
    }

    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
    })
}

setupMatchMedia()

export default setupMatchMedia
