const config = require('../config');
const NewsAPI = require('newsapi');
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

function getKeyParam(params, keyword) {
  const key = (
    params.filter(item => item.indexOf(`${keyword}=`) !== -1)[0] || ''
  ).replace(`${keyword}=`, '')
    .replace(/[^\w\s]/g, '');

  return key || null;
}

module.exports = function(context, params) {
  const q = getKeyParam(params, 'q');
  const category = getKeyParam(params, 'category');
  const language = getKeyParam(params, 'language') || 'id';
  const country = getKeyParam(params, 'country') || 'id';
  const username = context.update.message.from.username;
  const key = `${q}-${category}-${language}-${country}`;

  return new Promise(async (resolve, reject) => {
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
  
      const result = newsCache[key][0];
      newsCache[key].shift();
      context.reply(result);
    } catch (e) {
      reject(e);
    }
  });
};