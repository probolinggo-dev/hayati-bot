const config = require('../config');
const NewsAPI = require('newsapi');
const getKeyParam = require('../utils/getKeyParams');
const newsapi = new NewsAPI(config.newsApiToken);
let newsCache = {};

const getHeadlines = async (options) => {
  return new Promise(async (resolve) => {
    try {
      const response = await newsapi.v2.topHeadlines(options);
      resolve(response.articles.map(item => item.url));
    } catch (e) {
      resolve(['lagi error nih kak']);
    }
  });
};

module.exports = async function(context, params) {
  const q = getKeyParam(params, 'q');
  const category = getKeyParam(params, 'category');
  const language = getKeyParam(params, 'language') || 'id';
  const country = getKeyParam(params, 'country') || 'id';
  const username = context.update.message.from.username;
  const key = `${q}-${category}-${language}-${country}`;

  try {
    if ((newsCache[key] || []).length === 0) {
      const headlines = await getHeadlines({
        q,
        category,
        language,
        country,
      });
      if (headlines.length === 0) {
        return context.replyWithMarkdown(`@${username} aku gak nemu headline tentang *${q}* kak, maaf :(`);
      }
      newsCache[key] = headlines;
    }

    const result = newsCache[key].shift();
    context.reply(result);
  } catch (e) {
    context.reply('error kak :(');
  }
};