const fs = require('fs');
const path = require('path');
const Telegraf = require('telegraf');
const routes = require('./routes');
const utils = require('./utils');
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

bot.hears('Udah Pada Ngopi?', ctx => {
    ctx.replyWithAudio({
        source: fs.createReadStream(path.join(__dirname, 'assets/audio/ngopi.mp3')),
        title: 'Udah Pada Ngopi Belom Bro'
    });
});

bot.on('text', (ctx) => {
    ctx.reply(utils.getRandomMessage());
})

bot.startPolling();