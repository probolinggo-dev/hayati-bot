const getNews = require('./actions/getNews');
const getGempa = require('./actions/getGempa');
const getBpi = require('./actions/getBpi');
const getBookOffer = require('./actions/getBookOffer');
const getKurs = require('./actions/getKurs');
const getRules = require('./actions/getRules');

const hears = [
  {
    prefix: /gempa/,
    action: getGempa,
  },
  {
    prefix: /(bpi|bitcoin)/i,
    suffix: /((hari ini)|(dino iki))/i,
    action: getBpi,
  },
];

const commands = [
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
  {
    command: 'rules',
    action: getRules,
  }
];

const events = [
  {
    event: 'new_chat_members',
    action: context => {
      const username = context.update.message.from.username;
      const firstname = context.update.message.from.first_name;
      const lastname = context.update.message.from.last_name;
      context.reply(`selamat datang **${firstname} ${lastname}** @${username}  silahkan perkenalkan diri kak`);
    },
  },
];

module.exports = [...hears, ...commands, ...events];
