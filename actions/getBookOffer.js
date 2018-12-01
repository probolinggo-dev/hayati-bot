/**
 * Created by: 
 * Muhammad Bukhori Muslim
 * #probolinggoDev
 * @mosleim (github, gitlab, wordpress,stackoverflow, gmail, ymail,fb, twitter)
 * http://www.mosleim.com
 * 
 */

const request = require('request');
const cheerio = require('cheerio');

const getBookOffer = async (context) => {
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: 'https://www.packtpub.com/packt/offers/free-learning',
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
        }
      };

      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          try {
            let $ = cheerio.load(body);
            let judul = $('#title-bar-title').text();
            let data = `
kak, hari ini ada buku *${judul}*, gratis lo kak.
cepetan cek di sini kak: https://www.packtpub.com/packt/offers/free-learning
Semoga kakak beruntung ya
#probolinggoDev
            `;
            resolve(data);
          } catch (err) {
            reject('Sori kak, aku lagi ada gangguan');
          }
        } else {
          reject('Si Packpub gak online deh kayaknya kak.');
        }
      });
    }
  )
    .then(data => {
      if (!data)
        context.reply('gak ketemu kak, dari pada nyari buku gak ketemu, gimana kalau ketemuan sama aku aja kak?.');
      
      context.replyWithMarkdown(data)
        .catch(() => context.reply('hemm..., bingung aku kak'));
    })
    .catch((reason) => {
      throw reason;
    });
};

module.exports = getBookOffer;
