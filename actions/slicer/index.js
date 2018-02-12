/*
 * Web Scraper
 * originally from http://techslides.com/curl-with-nodejs (Curl with nodejs)
 */

const request = require("request");
const slicer = require("./slicer");

// text telegram format
const printData = (data) => {
    var print = "";
    data.forEach(function (value) {
        print += "*" + value.title + "*\n";
        let items = value.item;
        items.forEach(function (item) {
            print += "- _" + item.title + "_\n";
        });
    });

    return print;
}

const scrape = async (url) => {
    return new Promise(
        (resolve, reject) => {
            const options = {
                url : "https://builtwith.com/"+ url,
                headers : {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36" 
                }
            };

            request(options, function(error, response, body){
                if (!error && response.statusCode === 200) {
                    try {
                        let data = slicer.builtweb(body);
                        resolve(data);
                    } catch (err) {
                        reject("Maaf terjadi gangguan");
                    }
                } else {
                    reject("Jaringan bermasalah"); 
                } 
            });    
        } 
    )
    .then((data) => {
        return printData(data); 
    })
    .catch((reason) => {
        return reason; 
    });
}

module.exports = {
    scrape
}
