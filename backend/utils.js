export const extractEns = (name) => {
  try {
    const regex = new RegExp(/[^\s(｜|]+(.eth)/i);
    // Transform to lowercase
    let ensName = name.match(regex)[0].toLowerCase()

    // Replace Ξ with e
    ensName = ensName.replace(/ξ/g, "e");

    return (ensName);
  } catch (error) {
    return null;
  }
};

export const chunkArray = (allData, numberInEachChunk) => {
  const chunkedArray = [];
  const chunkSize = numberInEachChunk;
  for (let i = 0; i < allData.length; i += chunkSize) {
    chunkedArray.push(allData.slice(i, i + chunkSize));
  }
  return chunkedArray;
};

export function processArray(array, fn) {
  return array.reduce(function (p, item) {
    return p.then(function () {
      return fn(item);
    });
  }, Promise.resolve());
}
