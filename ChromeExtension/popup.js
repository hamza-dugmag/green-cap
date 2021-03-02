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


var rating_imgs = ["img/1.png", "img/2.png", "img/3.png", "img/4.png", "img/5.png"];


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

    // pitch rigging
    if (info.productTitle == "Kirkland Signature Steak Strips Extra Thick Cut -340g") {
        score = [52, 3, 1, "https://www.amazon.ca/Dick-Duffs-Organic-Jerky-Certified/dp/B07ZG5LZ2Q/ref=sr_1_5?dchild=1&keywords=organic+meat&qid=1614654770&sr=8-5"];
    }
    else if (info.productTitle == "Dick Duff's Organic Jerky - Made in Canada Beef Jerky - 18g of Protein per Serving - Certified Organic (Dijon Mustard - 50g Bag)") {
        score = [12, 5, 5, "https://www.amazon.ca/Dick-Duffs-Organic-Jerky-Certified/dp/B07ZG5LZ2Q/ref=sr_1_5?dchild=1&keywords=organic+meat&qid=1614654770&sr=8-5"];
    }

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
    else if (score[0] < 15)
        normalized_planet = 5;
    else if (score[0] < 20)
        normalized_planet = 4;
    else if (score[0] < 30)
        normalized_planet = 3;
    else if (score[0] < 50)
        normalized_planet = 2;
    else
        normalized_planet = 1;

    // score the product
    var rating_index = Math.abs(Math.floor((score[1]-1 + score[2]-1 + normalized_planet-1)/3));
    document.getElementById("rating").src = rating_imgs[rating_index];

    // link
    if (rating_index < 3)
        document.getElementById("alt").innerHTML = "<a href=" + score[3] + " target='_blank'>" + "Recommendation" + "</a>";
    
    // change border gradient based on rating
    switch (rating_index)
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
            document.body.style.backgroundImage = "linear-gradient(to bottom right, rgb(25, 255, 75), rgb(25, 255, 255))";
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
