const request = require('request');
const parseString = require('xml2js').parseString;

const getGempa = async() => {
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: 'http://data.bmkg.go.id/autogempa.xml',
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
        }
      };

      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          try {
            let data= '';
            var data_; 
            parseString(body, 
              function (err, result) {				
                data_=result.Infogempa.gempa[0];		
              }
            );
            // data=data_;
            data = `
*Tanggal : * ${data_.Tanggal[0]}
*Jam : * ${data_.Jam[0]}
*Lintang : * ${data_.Lintang[0]}
*Bujur : * ${data_.Bujur[0]}
*Magnitude : * ${data_.Magnitude[0]}
*Kedalaman : * ${data_.Kedalaman[0]}
*Potensi : * ${data_.Potensi[0]}
*Lokasi : * ${data_.Wilayah1[0]}
              `;
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
        throw 'aku nanyak BMKG, gak tahu juga kak. coba tanya tetangga sebelah kak.';
      return data;
    })
    .catch((reason) => {
      throw reason;
    });
};

module.exports = getGempa;
