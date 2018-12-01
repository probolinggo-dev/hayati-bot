const fetch = require('node-fetch');

module.exports = function() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/idr.json');
      const data = await response.json();
      resolve(`Harga bitcoin hari ini ${data.bpi.IDR.rate} IDR kakak ...`);
    } catch(e) {
      reject(e);
    }
  });
};