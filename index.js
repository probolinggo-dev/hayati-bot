const Telegraf = require('telegraf');
const routes = require('./routes');
const config = require('./config');
const bot = new Telegraf(config.botToken, {username: 'mbak_hayati_bot'});

const misuhLimit = {};

bot.hears(/(jancuk|kontol|memek|goblok|tolol)/i, context => {
  const username = context.update.message.from.username;
  const limit = misuhLimit[username];
  if (!limit || limit < 2) {
    misuhLimit[username] = limit ? limit + 1 : 1;
    context.reply(`@${username} gak boleh ngomong kasar! ${3 - misuhLimit[username]} kali lagi ngomong jorok aku kick ya!`);
  } else {
    try {
      const user_id = context.update.message.from.id;
      context.kickChatMember(user_id);
    } catch(err) {
      context.reply(`error ngekick @${username} nih :(`);
    }
  }
});

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
