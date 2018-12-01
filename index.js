const Telegraf = require('telegraf');
const routes = require('./routes');
const utils = require('./utils');
const config = require('./config');
const bot = new Telegraf(config.botToken);

routes.forEach(item => {
  if (item.event) {
    bot.on(item.event, async ctx => {
      item.action(ctx);
    });
  }

  if (item.command) {
    bot.command(item.command, async (ctx) => {
      const message = ctx.update.message.text;
      const params = message
        .replace(`/${item.command} `, '')
        .split(/ +(?=[\w]+:)/g)
        .filter(item => !!item);
      item.action(ctx, params);
    });
  } else if (item.suffix) {
    bot.hears(item.suffix, (ctx) => {
      const message = ctx.match.input;
      if (!item.prefix) {
        item.action()
          .then(res => ctx.reply(res))
          .catch(() => ctx.reply('maaf, ada kesalahan di server hayati kak'));
      }
  
      if (message.match(item.prefix)) {
        item.action()
          .then(res => ctx.reply(res))
          .catch(() => ctx.reply('maaf, ada kesalahan di server hayati kak'));
      } else {
        ctx.reply(utils.getRandomMessage());
      }
    });
  }
});

bot.startPolling();
