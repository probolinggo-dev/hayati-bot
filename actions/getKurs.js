const request = require('request');
const cheerio = require('cheerio');

const errorMessage = `
*bukan gitu caranya kak!*
caranya adalah \`/kurs symbol_kurs\` contoh \`/kurs usd\`

*Contoh Kurs yang bisa dipakai:*
- USD
- JPY
- AUD
- EUR
- Dan lain lain
  `;

const kursin = async(context, params) => {
  const mata_uang = params[0];
  const username = context.update.message.from.username;
  if (!mata_uang) {
    return context.replyWithMarkdown(errorMessage);
  }
  context.reply(`@${username} wait kak, aku tanyain ke BI bentar ..`);
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
            let data= '';
            $('table#ctl00_PlaceHolderMain_biWebKursTransaksiBI_GridView1 tr').each((i, value) => {
              var t =$(value).find('td,th')
                .not($(value).find('td,th').last())
                .map(function(i, el){
                  return $(el).text();
                });
              if(mata_uang.toUpperCase() + '  ' == t.get(0).valueOf().toUpperCase())
                data = `
*Harga Jual*
Rp. ${t.get(2)}
*Harga Beli*
Rp. ${t.get(3)}

*Per ${t.get(1)} ${t.get(0).replace(/\s/g,'')}*
                `;
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
        return 'aku nanyak BI, gak tahu juga kak. coba tanya tetangga sebelah kak.';
      context.reply(`@${username} ini kak`);
      context.replyWithMarkdown(data)
        .catch(() => context.reply(`@${username} aku ndak tau juga kak`));
    })
    .catch(() => {
      context.reply(`@${username} duh error kak!`);
    });
};

module.exports = kursin;
