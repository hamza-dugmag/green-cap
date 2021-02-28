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

var ratings = ["img/trash.png", "img/bad.png", "img/meh.png", "img/good.png", "img/great.png"];


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
    document.getElementById("name").innerText = info.productTitle.substring(0, 35) + "...";  // product title

    // http request to GreenCap server
    var price = get_price(info.productPrice);
    var items = get_items(info.productCategories);
    var http_link = "https://l90oikv0ue.execute-api.us-east-2.amazonaws.com/test/greencap?category=" + items[items.length - 1] + "&price=" + price.toString();
    json_get = JSON.parse(httpGet(http_link));
    
    var score = [json_get.planet, json_get.people, json_get.animals, json_get.recommended];

    // display score
    if (score[0] != 0) 
        document.getElementById("planet").innerText = (Math.round(score[0])).toString() + " kg CO2";
    else
        document.getElementById("planet").innerText = "Unknown...";
    document.getElementById("people").innerText = score[1].toString() + "/5";
    document.getElementById("animals").innerText = score[2].toString() + "/5";

    // convert kg to 1-5 rating
    var normalized_planet = 0;
    if (score[0] == 0)
        normalized_planet = 1;
    else if (score[0] < 10)
        normalized_planet = 5;
    else if (score[0] < 25)
        normalized_planet = 4;
    else if (score[0] < 50)
        normalized_planet = 3;
    else if (score[0] < 100)
        normalized_planet = 2;
    else
        normalized_planet = 1;

    // score the product
    var ranking_index = Math.abs(Math.floor((score[1]-1 + score[2]-1 + normalized_planet-1)/3));
    document.getElementById("rating").src = ratings[ranking_index];

    // link
    if (ranking_index < 3)
        document.getElementById("alt").innerHTML = "<a href=" + score[3] + " target='_blank'>" + "Recommendation" + "</a>";
    
    switch (ranking_index)
    {
        case 0:
            document.body.style.backgroundImage = "linear-gradient(to bottom right, rgb(0, 0, 0), rgb(181, 0, 0))";
            break;
        
        case 1:
            document.body.style.backgroundImage = "linear-gradient(to bottom right, rgb(0, 0, 0), rgb(219, 128, 24))";
            break;
        
        case 2:
            document.body.style.backgroundImage = "linear-gradient(to bottom right, rgb(0, 0, 0), rgb(224, 211, 67))";
            break;

        case 3:
            document.body.style.backgroundImage = "linear-gradient(to bottom right, rgb(0, 0, 0), rgb(112, 224, 67))";
            break;
        
        case 4:
            document.body.style.backgroundImage = "linear-gradient(to bottom right, rgb(0, 0, 0), rgb(66, 245, 224))";
            break;
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
