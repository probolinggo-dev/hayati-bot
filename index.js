const fs = require('fs');
const path = require('path');
const Telegraf = require('telegraf');
const routes = require('./routes');
const utils = require('./utils');
const jadwalin = require('jadwalin');
const fetch = require('node-fetch');
const {
  wikipedia
} = utils;
const TurndownService = require('turndown');
const turndownService = new TurndownService();
const slicer = require('./actions/slicer');
const translate = require('google-translate-api');
require('dotenv').config();
const subscribers = [];

const bot = new Telegraf(process.env.BOT_TOKEN);

jadwalin(async () => {
  try {
    const response = await fetch('https://api.probolinggodev.org/quote/random');
    const data = await response.json();
    subscribers.forEach(item => {
      bot.telegram.sendMessage(item, `Selamat siang kakak. Quotes pagi ini "${data.content}" ~${data.author}`);
    });
  } catch (err) {
    throw err;
  }
}).setiap('12:10');

routes.forEach(item => {
  bot.hears(item.firstMatch, (ctx) => {
    const message = ctx.match.input;
    if (!item.secondMatch) {
      return item.action()
        .then(res => ctx.reply(res))
        .catch(() => ctx.reply('maaf, ada kesalahan di server hayati kak'));
    }

    if (message.match(item.secondMatch)) {
      return item.action()
        .then(res => ctx.reply(res))
        .catch(() => ctx.reply('maaf, ada kesalahan di server hayati kak'));
    } else {
      return ctx.reply(utils.getRandomMessage());
    }
  });
});

bot.hears(/((hayati jahat)|(kamu jahat))/, ctx => {
  ctx.replyWithAudio({
    source: fs.createReadStream(path.join(__dirname, 'assets/audio/zainudin-kejam.mp3')),
    title: 'Zainudin 😭'
  });
});

bot.hears(/udah/, ctx => {
  const message = ctx.match.input;
  if (message.match(/(ngopi|(minum kopi))/)) {
    ctx.replyWithAudio({
      source: fs.createReadStream(path.join(__dirname, 'assets/audio/ngopi.mp3')),
      title: 'Udah Pada Ngopi Belom Bro'
    });
  }
});

bot.command('wiki', async ctx => {
  try {
    let message = ctx.update.message.text;
    if (message === '/wiki') return false;
    message = message.replace('/wiki ', '');
    const response = await wikipedia.search(message);
    ctx.replyWithMarkdown(
      turndownService.turndown(response)
    );
  } catch (e) {
    ctx.reply('aku ndak tau kalo itu kak');
  }
});

bot.command('builtwith', async (ctx) => {
  try {
    let message = ctx.update.message.text;
    if (message === '/builtwith') {
      return false;
    }
    message = message.replace('/builtwith ', '');
    const response = await slicer.scrape(message);
    ctx.replyWithMarkdown(response)
      .catch(() => ctx.reply('aku ndak tau kalo itu kak'));
  } catch (err) {
    ctx.reply(err);
  }
});

bot.command('translate', async (ctx) => {
  let message = ctx.update.message.text;
  if (message === 'translate') {
    return false;
  }
  message = message.replace('/translate ', '');
  translate(message, {
    from: 'auto',
    to: 'id'
  }).then((res) => {
    ctx.reply(res.text);
  }).catch((err) => {
    ctx.reply(err);
  });
});

let randomReply = true;
bot.on('text', (ctx) => {
  const chatid = ctx.update.message.chat.id;
  if (subscribers.indexOf(chatid) === -1) {
    subscribers.push(chatid);
  }
  if (randomReply) {
    randomReply = false;
    const message = utils.getRandomMessage();
    if (typeof message === 'string') {
      ctx.reply(message);
    }

    switch (message.type) {
    case 'video':
      ctx.replyWithVideo({
        source: message.source,
      });
      break;
    case 'photo':
      ctx.replyWithPhoto({
        source: message.source,
      });
      break;
    case 'audio':
      return ctx.replyWithAudio({
        source: message.source,
      });
    case 'markdown':
      ctx.replyWithMarkdown(message.source);
      break;
    default:
      return;
    }

    setTimeout(() => {
      randomReply = true;
    }, 60000 * 10);
  }
});

bot.startPolling();
