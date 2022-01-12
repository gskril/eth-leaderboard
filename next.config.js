module.exports = {
  images: {
    domains: ["metadata.ens.domains", "unavatar.io"],
    minimumCacheTTL: 86400,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};
