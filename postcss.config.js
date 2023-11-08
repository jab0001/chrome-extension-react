module.exports = {
  plugins: [
    'postcss-preset-env',
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-prefix-selector")({
      prefix: '.parent-flg',
      exclude: ['.font-SFUIText'],
      exclude: ['.font-SFUIDisplay'],
    }),
    'cssnano'
  ],
};
