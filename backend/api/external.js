import fetch from "node-fetch";

export const fetchEnsStats = () =>
  fetch("https://api.opensea.io/api/v1/collection/ens/stats", {
    method: "GET",
    headers: { Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((res) => {
      return new Intl.NumberFormat().format(res.stats.count);
    })
    .catch((err) => {
      try {
        console.log(
          "Error fetching data from OpenSea API.",
          err.response.statusText
        );
      } catch (error) {
        console.log(
          "Error fetching data from OpenSea API.",
          err
        );
      }
      return 0;
    });
