// import * as srt from "./scripts/sorter.js";


// ============================================================= from sorter.js
function get_price(string) {
    string = string.replace(/(<([^›>]+)>)/gi, "");

    var activation = 0;
    var price = "";
    for (letter in string) {
        if (activation == 1) {
            price += string[letter]
        }
        if ((activation == 1) && (string[letter] == " ")) {
            break;
        }
        if ((string[letter]) == ";") {
            activation = 1;
        }
    }
    return (Number(price));
}


function get_items(string) {
    string = string.replace(/(<([^›>]+)>)/gi, "");
    string = string.replace(/amp;/g, "");

    list = [];
    counter = 0;

    while (counter < string.length) {
        if (((string.slice(counter,counter+1)) == " ") && ((string.slice(counter+1, counter+2)) == " ") && ((string.slice(counter+2, counter+3)) != " ")) {
            ending = string.indexOf("  ", counter+2)
            newstring = string.slice(counter+2, ending);

            if (newstring.length > 3) {
                list.push(newstring);
            }
        }
        counter += 1;
    }
    return list;
}
// =============================================================

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


// https://stackoverflow.com/questions/247483/http-get-request-in-javascript
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


// Update the relevant fields with the new data.
const setDOMInfo = info => {
    document.getElementById('name').innerText = info.productTitle.substring(0, 35) + "...";  // product title
    
    // if (info.productTitle.substring(0, 5) == "Otter" || info.productTitle.substring(0, 5) == "Spige" || info.productTitle.substring(0, 5) == "LK iP") {
    //   document.getElementById("rating").src = ratings[randint(3, 4)];  // high rating if one of the good ones
    // }
    // else {
    //     document.getElementById("rating").src = ratings[randint(0, 2)];  // bad rating if one of the bad ones
    //     randLink = randint(0, 2);  // random alternative
    //     document.getElementById("alt").innerHTML = "<a href=" + altLinks[randLink] + " target='_blank'>" + alternatives[randLink] + "</a>"
    // }

    // http request to GreenCap server
    var price = get_price(info.productPrice);  // IMPORT SORTER
    var items = get_items(info.productCategories);  // IMPORT SORTER
    var http_link = "https://l90oikv0ue.execute-api.us-east-2.amazonaws.com/test/greencap?category=" + items[items.length - 1] + "&price=" + price.toString();
    json_get = JSON.parse(httpGet(http_link));
    var score = json_get.score;
    console.log(score);

    // display score
    var bracket_size = 1/(ratings.length);
    var ranking_index = 0;
    if (score < 5)
        ranking_index = 0;
    else if (score < 15)
        ranking_index = 1;
    else if (score < 40)
        ranking_index = 2;
    else if (score < 60)
        ranking_index = 3;
    else
        ranking_index = 4;
    document.getElementById("rating").src = ratings[ranking_index];

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
