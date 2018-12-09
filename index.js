const Telegraf = require('telegraf');
const routes = require('./routes');
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
        .split(/\s(?=(?:[^'"`“]*(['"`”]).*?\1)*[^'"`”]*$)/g)
        .filter(item => !!item);
      item.action(ctx, params);
    });
  }

  if (item.prefix) {
    bot.hears(item.prefix, ctx => {
      const message = ctx.match.input;
      if (item.suffix) {
        if (message.match(item.suffix) !== null) item.action(ctx);
      } else {
        item.action(ctx);
      }
    });
  }
});

bot.startPolling();
