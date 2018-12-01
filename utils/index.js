const wikipedia = require('./wikipedia');
const fs = require('fs');
const path = require('path');

const randomMessage = [
  'apa',
  'gak tau',
  'https://media.giphy.com/media/C9ICNxlhSUiPu/giphy.gif',
  'mbuh',
  'males ah',
  'mandi dulu sana',
  'https://media.giphy.com/media/3otPotbzJxTYspCqxW/giphy.gif',
  'cuci muka dulu sana',
  'apanya',
  'ooooooooooh',
  'https://media.giphy.com/media/3oFzmqVNa2wOiADQRi/giphy.gif',
  'ha?',
  {
    type: 'video',
    source: fs.createReadStream(path.join(__dirname, '../assets/video/bingung.mp4')),
  },
  {
    type: 'video',
    source: fs.createReadStream(path.join(__dirname, '../assets/gif/lol.gif')),
  },
  'apasih beb',
  'cerewet',
  'main sama ayam sana https://gph.is/1uRZi9z',
  'https://media.giphy.com/media/l1J9I0c0AvHvVMptC/giphy.gif',
  'mandiin kambing gih',
  'udah minum obat?',
];

const getRandomMessage = () => {
  return randomMessage[Math.floor(Math.random()*randomMessage.length)];
};

module.exports = {
  wikipedia,
  getRandomMessage,
};
