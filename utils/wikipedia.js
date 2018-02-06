const fetch = require('node-fetch');
const R = require('ramda');

const search = async keyword => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${keyword}&format=json`);
      const data = await response.json();
      const snippet = R.pathOr(null, ['query','search','0','snippet'], data)
      if (!snippet)
        reject({message: 'not found!'});

      resolve(snippet);

    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  search,
};
