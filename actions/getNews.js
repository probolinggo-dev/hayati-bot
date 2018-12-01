const config = require('../config');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(config.newsApiToken);
let newsCache = [];

const getHeadlines = async () => {
  return new Promise(async (resolve) => {
    try {
      const response = await newsapi.v2.everything({
        sources: 'the-verge,the-next-web,tech-crunch',
        language: 'en',
      });
      resolve(response.articles.map(item => item.url));
    } catch (e) {
      resolve(['lagi error nih kak']);
    }
  });
};

module.exports = function() {
  return new Promise(async (resolve, reject) => {
    try {
      if (newsCache.length === 0) {
        newsCache = await getHeadlines();
      }
  
      const result = newsCache[0];
      newsCache.shift();
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};