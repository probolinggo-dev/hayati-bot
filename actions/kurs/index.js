const request = require('request')
const cheerio = require('cheerio')

const kursin = async(mata_uang) => {
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: 'https://www.bi.go.id/id/moneter/informasi-kurs/transaksi-bi/Default.aspx',
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
        }
      };

      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          try {
		let $ = cheerio.load(body);
		let data= "";
		$('table#ctl00_PlaceHolderMain_biWebKursTransaksiBI_GridView1 tr').each((i, value) => {
			var t =$(value).find("td,th")
				.not($(value).find("td,th").last())
				.map(function(i, el){
				return $(el).text();
			});
			if(mata_uang.toUpperCase() + "  " == t.get(0).valueOf().toUpperCase())
				data = "BI jualnya seharga " + t.get(2) + ", belinya " + t.get(3) + " setiap " + t.get(1) + t.get(0).replace(/\s/g,'') + "-nya kak."
		});
            resolve(data);
          } catch (err) {
            reject('Maaf terjadi gangguan');
          }
        } else {
          reject('Jaringan bermasalah');
        }
      });
    }
  )
    .then((data) => {
      if (data=='')
          return "aku nanyak BI, gak tahu juga kak. coba tanya tetangga sebelah kak."
      return data;
    })
    .catch((reason) => {
	console.log("error di sini")
      return reason;
    });
};

//var p = kursin("USD")
//console.log("cek" + p)

module.exports = {
  kursin
};
