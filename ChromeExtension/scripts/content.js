// https://stackoverflow.com/questions/20019958/chrome-extension-how-to-send-data-from-content-script-to-popup-html

// Inform the background page that this tab should have a page-action.
chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {

    // First, validate the message's structure. Then, collect the necessary data.
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {

        // two options for price:
        var price = "";
        try {
            price = document.getElementById("priceblock_ourprice").innerHTML;
        }
        catch (err) {
            try {
                price = document.getElementById("priceblock_saleprice").innerHTML;
            }
            catch (err) {
                price = "";
            }
        }

        var domInfo = {
            productTitle: document.getElementById("productTitle").innerText,  // guaranteed to work
            productPrice: price,
            productCategories: document.getElementById("wayfinding-breadcrumbs_feature_div").innerHTML
        };
    
        // Directly respond to the sender (popup) through the specified callback.
        response(domInfo);
    }
});
