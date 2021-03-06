/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    [
      '@snowpack/plugin-svelte',
      '@snowpack/plugin-dotenv',
      "@snowpack/plugin-babel",
      {
        input: [
          ".js",
          ".mjs",
          ".jsx",
          ".ts",
          ".tsx"
        ]
      }
    ]
  ],

  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    target: 'es2018',
  },
};
