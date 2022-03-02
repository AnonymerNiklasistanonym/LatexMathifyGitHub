const defaultOptions = {
    debug: false,
    debugColor: 'red',
    enableObserver: true,
    mathmlOutput: false
}

/**
 * Save options from HTML inputs to local browser storage and show a HTML status text
 */
const saveOptions = () => {
    const debug = document.getElementById('debug').checked
    const debugColor = document.getElementById('debugColor').value
    const enableObserver = document.getElementById('enableObserver').checked
    const mathmlOutput = document.getElementById('mathmlOutput').checked
    if (typeof browser === "undefined") {
        // Make browser calls work on chrome
        var browser = chrome
    }
    const options = {
        debug,
        debugColor,
        enableObserver,
        mathmlOutput
    }
    browser.storage.sync.set(options, () => {
        // Update status to let user know options were saved
        const status = document.getElementById('status')
        status.textContent = `Options saved (${JSON.stringify(options)})`
        setTimeout(() => {
            status.textContent = ''
        }, 10000)
    })
}

/**
 * Load options from local browser storage and update HTML inputs
 */
const loadOptions = () => {
    if (typeof browser === "undefined") {
        // Make browser calls work on chrome
        var browser = chrome
    }
    browser.storage.sync.get(defaultOptions, options => {
        // Update status to let user know options were loaded
        const status = document.getElementById('status')
        status.textContent = `Options loaded (${JSON.stringify(options)})`
        setTimeout(() => {
            status.textContent = ''
        }, 10000)

        document.getElementById('debug').checked = options.debug
        document.getElementById('debugColor').value = options.debugColor
        document.getElementById('enableObserver').checked = options.enableObserver
        document.getElementById('mathmlOutput').checked = options.mathmlOutput
    })
}

/**
 * Reset options to defaults and update HTML inputs
 */
const resetOptions = () => {
    if (typeof browser === "undefined") {
        // Make browser calls work on chrome
        var browser = chrome
    }
    browser.storage.sync.set(defaultOptions, () => {
        // Update status to let user know options were loaded
        const status = document.getElementById('status')
        status.textContent = `Options were reset to default (${JSON.stringify(defaultOptions)})`
        setTimeout(() => {
            status.textContent = ''
        }, 10000)

        document.getElementById('debug').checked = defaultOptions.debug
        document.getElementById('debugColor').value = defaultOptions.debugColor
        document.getElementById('enableObserver').checked = options.enableObserver
        document.getElementById('mathmlOutput').checked = defaultOptions.mathmlOutput
    })
}

/**
 * Show if the browser api can be found
 */
const showBrowser = () => {
    if (typeof browser === "undefined") {
        // Make browser calls work on chrome
        var browser = chrome
    }
    const status = document.getElementById('statusBrowser')
    status.textContent = JSON.stringify(browser)
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('load').addEventListener('click', loadOptions);
document.getElementById('reset').addEventListener('click', resetOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('browser').addEventListener('click', showBrowser);
