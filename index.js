const Telegraf = require('telegraf');
const routes = require('./routes');
const utils = require('./utils');
const config = require('./config');
const bot = new Telegraf(config.botToken);

routes.forEach(item => {
  if (item.command) {
    bot.command(item.command, async (ctx) => {
      const message = ctx.update.message.text;
      const params = message
        .replace(`/${item.command }`, '')
        .split(' ')
        .filter(item => !!item);
      item.action(ctx, params);
    });
  } else {
    bot.hears(item.suffix, (ctx) => {
      const message = ctx.match.input;
      if (!item.prefix) {
        return item.action()
          .then(res => ctx.reply(res))
          .catch(() => ctx.reply('maaf, ada kesalahan di server hayati kak'));
      }
  
      if (message.match(item.prefix)) {
        return item.action()
          .then(res => ctx.reply(res))
          .catch(() => ctx.reply('maaf, ada kesalahan di server hayati kak'));
      } else {
        return ctx.reply(utils.getRandomMessage());
      }
    });
  }
});

bot.startPolling();
