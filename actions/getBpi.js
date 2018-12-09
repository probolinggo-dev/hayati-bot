const fetch = require('node-fetch');

module.exports = async function(context) {
  try {
    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/idr.json');
    const data = await response.json();
    context.replyWithMarkdown(`Harga bitcoin hari ini *Rp. ${data.bpi.IDR.rate}* kak`);
  } catch(err) {
    context.reply('error kak :(');
  }
};