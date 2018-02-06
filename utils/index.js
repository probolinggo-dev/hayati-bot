const wikipedia = require('./wikipedia');
const fs = require('fs');
const path = require('path');

const randomMessage = [
  'apa',
  'gak tau',
  'mbuh',
  'males ah',
  'mandi dulu sana',
  'cuci muka dulu sana',
  'apanya',
  'ooooooooooh',
  'ha?',
  {
    type: 'video',
    source: fs.createReadStream(path.join(__dirname, '../assets/video/bingung.mp4')),
  },
  {
    type: 'video',
    source: fs.createReadStream(path.join(__dirname, '../assets/gif/lol.gif')),
  }
]

const getRandomMessage = () => {
  return randomMessage[Math.floor(Math.random()*randomMessage.length)];
}

module.exports = {
  wikipedia,
  getRandomMessage,
}
