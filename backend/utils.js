export const extractEns = (name) => {
  try {
    const regex = new RegExp(
      /[a-zA-Z0-9\p{Emoji}][a-zA-Z0-9\p{Emoji}.-]+(.eth)/,
      "gui"
    );
    return name.match(regex)[0];
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
