const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');
const Telegraf = require('telegraf');
const routes = require('./routes');
const utils = require('./utils');
const jadwalin = require('jadwalin');
const fetch = require('node-fetch');
const config = require('./config');
const {
  wikipedia
} = utils;
const TurndownService = require('turndown');
const turndownService = new TurndownService();
const slicer = require('./actions/slicer');
const kursin = require('./actions/kurs');
const gempa = require('./actions/gempa');
const booksoffer = require('./actions/booksoffer');
const translate = require('google-translate-api');
const socket = io.connect(config.socketUrl);
const bot = new Telegraf(config.botToken);
const {chatId} = config;

let broadcastedUrls = [];
const dailyUrlSchedule = ['7:59', '12:59', '19:59'];
socket.on('hooker', async (payload) => {
  bot.telegram.sendMessage(chatId, payload.message);
});
const dailyUrl = async () => {
  try {
    const response = await fetch('https://api.probolinggodev.org/telegram/latest-urls');
    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
      if (broadcastedUrls.indexOf(data[i].url) === -1) {
        broadcastedUrls.push(data[i].url);
        bot.telegram.sendMessage(chatId, `"${data[i].description}" ${data[i].url}`);
        break;
      }
    }
  } catch (err) {
    throw err;
  }
};
dailyUrlSchedule.forEach(item => {
  jadwalin(dailyUrl).setiapJam(item);
});

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
    ctx.reply('duh error nih kak');
  }
});

bot.command('gempa', async (ctx) => {
  try {
    const response = await gempa.gempa();
    ctx.replyWithMarkdown(response)
      .catch(() => ctx.reply('aku ndak tau kalo itu kak'));
  } catch (err) {
    ctx.reply('duh error nih kak');
  }
});
bot.command('booksoffer', async (ctx) => {
  try {
    const respon = await booksoffer.booksoffer();
    ctx.replyWithMarkdown(respon)
      .catch(() => ctx.reply('hemm..., bingung aku kak'));
  } catch (err) {
    ctx.reply('aku error kak');
  }
});
bot.command('kurs', async (ctx) => {
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
  const username = ctx.update.message.from.username;
  let message = ctx.update.message.text;
  try {
    if (message === '/kurs') {
      return ctx.replyWithMarkdown(errorMessage);
    }

    ctx.reply(`@${username} wait kak, aku tanyain ke BI bentar ..`);

    message = message.replace('/kurs ', '');
    const response = await kursin.kursin(message);
    ctx.reply(`@${username} ini kak`);
    ctx.replyWithMarkdown(response)
      .catch(() => ctx.reply(`@${username} aku ndak tau juga kak`));
  } catch (err) {
    ctx.reply(`@${username} duh error kak!`);
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
  if (randomReply) {
    randomReply = false;
    setTimeout(() => {
      randomReply = true;
    }, 60000);
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
  }
});

bot.startPolling();
