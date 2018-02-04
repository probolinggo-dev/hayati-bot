const randomMessage = [
  'sek ta, aku lagi maen dota ini loh',
  'terserah mas',
  'wait, sek disuruh ibuk',
  'mboh',
  'galau aku rek :(',
  'aku masih di toilet',
  'jangan manggil aku tok raa',
  'aku sibuk, lagi nonton konser',
  'lagi coding kak, gabisa jawab',
  'lagi meeting aku kak, wait.',
  'bentar kak, sama ibuk disuruh tidur, aku pura-pura tidur dulu',
]

const getRandomMessage = () => {
  return randomMessage[Math.floor(Math.random()*randomMessage.length)];
}

module.exports = {
  getRandomMessage,
}
