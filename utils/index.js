const randomMessage = [
  'Rahasia 🤪',
  'huu ditanyain tok aku',
  'hayati capek kakak, gamau jawab',
  'hmmm, apa ya? sek tak googling',
  'hayati gak tau harus jawab apa',
  'terserah mas',
  'sek sek tak pikir',
]

const getRandomMessage = () => {
  return randomMessage[Math.floor(Math.random()*randomMessage.length)];
}

module.exports = {
  getRandomMessage,
}
