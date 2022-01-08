const extractEns = (string) => {
  return string.match(/[\w]*[.]eth/)[0]
}

module.exports = { extractEns }
