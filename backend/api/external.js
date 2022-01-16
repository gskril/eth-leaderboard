import fetch from "node-fetch";

export const fetchEnsStats = () =>
  fetch("https://api.opensea.io/api/v1/collection/ens/stats", {
    method: "GET",
    headers: { Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((res) => {
      return new Intl.NumberFormat().format(res.data.stats.count);
    })
    .catch((err) => {
      console.log(
        "Error fetching data from OpenSea API.",
        err.response.statusText
      );
      return 0;
    });
