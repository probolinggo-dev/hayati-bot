const news = require('./actions/news');
const fetch = require('node-fetch');

module.exports = [
  {
    firstMatch: /(berita|news)/,
    secondMatch: /((hari ini)|(dino iki)|selanjutnya)/i,
    action: () => {
      return new Promise(async (resolve, reject) => {
        try {
          const responseText = await news.getNews();
          resolve(responseText);
        } catch(e) {
          reject(e);
        }
      });
    }
  },
  {
    firstMatch: /((terima kasih)|makasih|kesuwon|(matur nuwun))/,
    action: () => {
      return new Promise((resolve) => {
        resolve('macama kakak 😬');
      });
    }
  },
  {
    firstMatch: /(bpi|bitcoin)/i,
    secondMatch: /((hari ini)|(dino iki))/i,
    action: () => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/idr.json');
          const data = await response.json();
          resolve(`Harga bitcoin hari ini ${data.bpi.IDR.rate} IDR kakak ...`);
        } catch(e) {
          reject(e);
        }
      });
    }
  },
];
