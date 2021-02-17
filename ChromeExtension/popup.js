// random parameters
var ratings = ["img/trash.jpg", "img/bad.jpg", "img/meh.jpg", "img/good.jpg", "img/great.jpg"];
var altLinks = [
    'https://www.amazon.ca/LK-Tempered-Protector-Shock-Absorption-Protection/dp/B07X2WV87Z/ref=sr_1_5?crid=2S9OOHKE5XUL9&dchild=1&keywords=iphone+case+11&qid=1611729768&sprefix=iphone+case+%2Caps%2C165&sr=8-5',
    'https://www.amazon.ca/Spigen-Ultra-Hybrid-Works-iPhone/dp/B07T2NBLX9/ref=sr_1_6?crid=2S9OOHKE5XUL9&dchild=1&keywords=iphone+case+11&qid=1611729768&sprefix=iphone+case+%2Caps%2C165&sr=8-6',
    'https://www.amazon.ca/OtterBox-Commuter-Case-iPhone-11/dp/B07W45LYY8/ref=sr_1_3?crid=2S9OOHKE5XUL9&dchild=1&keywords=iphone+case+11&qid=1611729837&sprefix=iphone+case+%2Caps%2C165&sr=8-3'
];
var alternatives = ['LK iPhone 11 Case', "Spigen Ultra Hybrid Case", "OtterBox Commuter Case"]


// random index generator
function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Update the relevant fields with the new data.
const setDOMInfo = info => {
    document.getElementById('name').innerText = info.productTitle.substring(0, 35) + "...";  // product title
    console.log(info.productPrice);
    console.log(info.productCategories);
    
    if (info.productTitle.substring(0, 5) == "Otter" || info.productTitle.substring(0, 5) == "Spige" || info.productTitle.substring(0, 5) == "LK iP") {
      document.getElementById("rating").src = ratings[randint(3, 4)];  // high rating if one of the good ones
    }
    else {
        document.getElementById("rating").src = ratings[randint(0, 2)];  // bad rating if one of the bad ones
        randLink = randint(0, 2);  // random alternative
        document.getElementById("alt").innerHTML = "<a href=" + altLinks[randLink] + " target='_blank'>" + alternatives[randLink] + "</a>"
    }

};

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
    // ...query for the active tab...
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(
            tabs[0].id,
            {from: 'popup', subject: 'DOMInfo'},
            // ...also specifying a callback to be called 
            //    from the receiving end (content script).
             setDOMInfo);
    });
});

// wayfinding-breadcrumbs_feature_div