const extractEns = (string) => {
    try {
        return string.match(/[\w]*[.]eth/)[0]
    } catch (error) {
        return null
    }
}

module.exports = { extractEns }
