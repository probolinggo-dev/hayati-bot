function getKeyParam(params, keyword) {
  const key = (
    params.filter(item => item.indexOf(`${keyword}=`) !== -1)[0] || ''
  ).replace(`${keyword}=`, '')
    .replace(/[^\w\s]/g, '');

  return key || null;
}

module.exports = getKeyParam;
