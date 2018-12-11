require('format-unicorn');
const R = require('ramda');
const config = require('../config');
const bot = require('../bot');
const fs = require('fs');
const path = require('path');
const request = require('request');
const parseString = require('xml2js').parseString;
const jadwalin = require('jadwalin');

const PATH = path.resolve(__dirname, 'gempa.temp.txt');
let limitter = {};
let blockedUser = {};
let currentData = '{"data": {}}';

const template = `
*Tanggal : * {tanggal}
*Jam : * {jam}
*Lintang : * {lintang}
*Bujur : * {bujur}
*Magnitude : * {magnitude}
*Kedalaman : * {kedalaman}
*Potensi : * {potensi}
*Lokasi : * {lokasi}
`;

// persist data into file on exit
process.on('SIGINT', function() {
  fs.writeFile(PATH, currentData, function(err) {
    console.log(err); // eslint-disable-line
    process.exit();
  });
});

// restore data from persistent
fs.readFile(PATH, 'utf8', function(err, data) {
  currentData = data;
});


const buildResponse = () => {
  const parsedCurrentData = JSON.parse(currentData);
  return template.formatUnicorn({
    tanggal: R.pathOr('Tidak diketahui', ['Tanggal', '0'], parsedCurrentData),
    jam: R.pathOr('Tidak diketahui', ['Jam', '0'], parsedCurrentData),
    lintang: R.pathOr('Tidak diketahui', ['Lintang', '0'], parsedCurrentData),
    bujur: R.pathOr('Tidak diketahui', ['Bujur', '0'], parsedCurrentData),
    magnitude: R.pathOr('Tidak diketahui', ['Magnitude', '0'], parsedCurrentData),
    kedalaman: R.pathOr('Tidak diketahui', ['Kedalaman', '0'], parsedCurrentData),
    potensi: R.pathOr('Tidak diketahui', ['Potensi', '0'], parsedCurrentData),
    lokasi: R.pathOr('Tidak diketahui', ['Wilayah1', '0'], parsedCurrentData)
  });
};

const getData = async() => {
  const options = {
    url: 'http://data.bmkg.go.id/autogempa.xml',
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      try {
        parseString(body, (err, res) => {
          const result = res.Infogempa.gempa[0];
          const resultString = JSON.stringify(result);

          if (currentData !== resultString) {
            currentData = resultString;
            limitter = {};
            blockedUser = {};
            bot.telegram.sendMessage(config.chatId, buildResponse(), {
              parse_mode: 'Markdown'
            });
          }
        });
      } catch (err) {
        console.log(err) // eslint-disable-line
      }
    } else {
      // should logged into real logger in the future
      console.log('error'); // eslint-disable-line
    }
  });
};

const scheduler1 = new jadwalin(getData);
const limitResetter = new jadwalin(() => {
  limitter = {};
  blockedUser = {};
});
limitResetter.setiapJam('1:10');
scheduler1.setiap(1000 * 60);
getData();

const getGempa = async(context) => {
  const username = context.update.message.from.username;
  if (limitter[username]) {
    if (!blockedUser[username]) {
      context.reply('jangan nanya mulu kak, kan tadi udah! datanya tetep sama kok, nanti kalo ada info gempa baru, aku kabarin deh!');
    }
  } else {
    limitter[username] = true;
    context.replyWithMarkdown(buildResponse());
  }
};

module.exports = getGempa;
