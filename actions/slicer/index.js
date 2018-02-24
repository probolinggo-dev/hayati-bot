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
};

const scrape = async (url) => {
    return new Promise(
        (resolve, reject) => {
            let headers = ["Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"];

            const options = {
                url : "https://builtwith.com/"+ url,
                headers : {
                    "User-Agent": headers[Math.floor((Math.random() * 3) + 0)],
                    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Connection":"keep-alive"
                }
            };

            request(options, function(error, response, body){
                if (!error && response.statusCode == 200) {
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
};

module.exports = {
    scrape
};