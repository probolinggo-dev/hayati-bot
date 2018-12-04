const fetch = require('node-fetch');

async function getRules(context) {
  const response = await fetch('http://api.probolinggodev.org/probolinggo-dev-web/api/web/index.php?r=appparam/view&id=RULES');
  const data = await response.json();
  context.replyWithMarkdown(data.value);
}

module.exports = getRules;