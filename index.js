const fs = require('fs');
const path = require('path');
const Telegraf = require('telegraf');
const routes = require('./routes');
const utils = require('./utils');
const {wikipedia} = utils;
const TurndownService = require('turndown')
const turndownService = new TurndownService()
const slicer = require('./actions/slicer');
const translate = require('google-translate-api');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

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

bot.command('builtwith', async ctx => {
  try {
      let message = ctx.update.message.text;
      if (message === '/builtwith') return false;
      message = message.replace('/builtwith ', '');
      const response = await slicer.scrape(message);
      ctx.replyWithMarkdown(response)
      .catch(() => ctx.reply('aku ndak tau kalo itu kak'));
  } catch (e) {
      ctx.reply('aku ndak tau kalo itu kak');
  }
});

bot.command('translate', async ctx => {
  let message = ctx.update.message.text;
  if (message === '/translate') return false;
  message = message.replace('/translate ', '');
  translate(message, {from: 'auto', to: 'id'}).then(res => {
    ctx.reply(res.text);
  }).catch(err => {
    ctx.reply('tak tahu aku kak');
  });
});

let randomReply = true;
bot.on('text', (ctx) => {
  if (randomReply) {
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
        })
      case 'markdown':
        ctx.replyWithMarkdown(message.source);
        break;
      default:
        return;
    }

    randomReply = false;
    setTimeout(() => {
      randomReply = true;
    }, 30000 * 1);
  }
});

bot.startPolling();
