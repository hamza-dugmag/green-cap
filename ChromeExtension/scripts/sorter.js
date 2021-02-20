var fs = require('fs'); //Filesystem    

var content = fs.readFileSync("item.html","utf-8");

let strippedString = content.replace(/(<([^›>]+)>)/gi, "");

function price(string) {
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


function items(string) {
    string = string.replace(/amp;/g, "");
    list = [];
    counter = 0;

    while (counter < string.length) {
        if (((string.slice(counter,counter+1)) == " ") && ((string.slice(counter+1, counter+2)) == " ") && ((string.slice(counter+2, counter+3)) != " ")) {
            ending = string.indexOf("  ", counter+2)
            newstring = string.slice(counter+2, ending);
            //console.log(newstring)
            if (newstring.length > 3) {
                list.push(newstring);
            }
        }
        counter += 1;
    }
    return list;
}

    

a = (items(strippedString))

for (item in a) {
    console.log(a[item]);
}