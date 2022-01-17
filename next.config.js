module.exports = {
  images: {
    domains: ["metadata.ens.domains", "pbs.twimg.com", "abs.twimg.com"],
    minimumCacheTTL: 86400,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.experiments.topLevelAwait = true;
    return config;
  },
};
