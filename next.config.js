const { withPlausibleProxy } = require('next-plausible');

module.exports = withPlausibleProxy()({
  images: {
    domains: [
      'metadata.ens.domains',
      'unavatar.io',
      'pbs.twimg.com',
      'abs.twimg.com',
    ],
    minimumCacheTTL: 86400,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.experiments.topLevelAwait = true;
    return config;
  },
});
