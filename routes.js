const getNews = require('./actions/getNews');
const getGempa = require('./actions/getGempa');
const getBpi = require('./actions/getBpi');
const getBookOffer = require('./actions/getBookOffer');
const getKurs = require('./actions/getKurs');

module.exports = [
  {
    suffix: /gempa/,
    action: getGempa,
  },
  {
    suffix: /(bpi|bitcoin)/i,
    prefix: /((hari ini)|(dino iki))/i,
    action: getBpi,
  },
  {
    command: 'bookoffer',
    action: getBookOffer,
  },
  {
    command: 'kurs',
    action: getKurs,
  },
  {
    command: 'news',
    action: getNews,
  },
];
