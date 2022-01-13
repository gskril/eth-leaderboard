const extractEns = (string) => {
    try {
        return string.match(/[\w]*[.]eth/)[0]
    } catch (error) {
        return null
    }
}

const chunkArray = (allData, numberInEachChunk) => {
    const chunkedArray = []
    const chunkSize = numberInEachChunk
    for (let i = 0; i < allData.length; i += chunkSize) {
        chunkedArray.push(allData.slice(i, i + chunkSize))
    }
    return chunkedArray
}

module.exports = { extractEns, chunkArray }
