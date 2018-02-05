const fs = require('fs');
const path = require('path');
const Telegraf = require('telegraf');
const routes = require('./routes');
const utils = require('./utils');
const {wikipedia} = utils;
const TurndownService = require('turndown')
const turndownService = new TurndownService()
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

bot.command('wikihayati', async ctx => {
  let message = ctx.update.message.text;
  if (message === '/wikihayati') return false;
  message = message.replace('/wikihayati ', '');
  const response = await wikipedia.search(message);
  ctx.replyWithMarkdown(
    turndownService.turndown(response)
  );
})

bot.command('wiki', async ctx => {
  let message = ctx.update.message.text;
  if (message === '/wiki') return false;
  message = message.replace('/wiki ', '');
  const response = await wikipedia.search(message);
  ctx.replyWithMarkdown(
    turndownService.turndown(response)
  );
})

let randomReply = true;
bot.on('text', (ctx) => {
  if (randomReply) {
    ctx.reply(utils.getRandomMessage());
    randomReply = false;
    setTimeout(() => {
      randomReply = true;
    }, 60000 * 10);
  }
});

bot.startPolling();
