// https://stackoverflow.com/questions/20019958/chrome-extension-how-to-send-data-from-content-script-to-popup-html
chrome.runtime.onMessage.addListener((msg, sender) => {
    // First, validate the message's structure.
    if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
        // Enable the page-action for the requesting tab.
        chrome.pageAction.show(sender.tab.id);
    }
});
