var images = ["trash.jpg", "bad.jpg", "meh.jpg", "good.jpg", "great.jpg"];
var hrefs = [
    'https://www.amazon.ca/LK-Tempered-Protector-Shock-Absorption-Protection/dp/B07X2WV87Z/ref=sr_1_5?crid=2S9OOHKE5XUL9&dchild=1&keywords=iphone+case+11&qid=1611729768&sprefix=iphone+case+%2Caps%2C165&sr=8-5',
    'https://www.amazon.ca/Spigen-Ultra-Hybrid-Works-iPhone/dp/B07T2NBLX9/ref=sr_1_6?crid=2S9OOHKE5XUL9&dchild=1&keywords=iphone+case+11&qid=1611729768&sprefix=iphone+case+%2Caps%2C165&sr=8-6',
    'https://www.amazon.ca/OtterBox-Commuter-Case-iPhone-11/dp/B07W45LYY8/ref=sr_1_3?crid=2S9OOHKE5XUL9&dchild=1&keywords=iphone+case+11&qid=1611729837&sprefix=iphone+case+%2Caps%2C165&sr=8-3'

];
var prods = ['LK iPhone 11 Case', "Spigen Ultra Hybrid Case", "OtterBox Commuter Case"]



// Update the relevant fields with the new data.
const setDOMInfo = info => {
    document.getElementById('name').innerText = info.msg;  // info.msg
    document.getElementById("rating").src = images[Math.floor(Math.random() * 4)];

    randLink = Math.floor(Math.random() * 3);
    document.getElementById("alt").innerHTML = "<a href=" + hrefs[randLink] + " target='_blank'>" + prods[randLink] + "</a>"
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