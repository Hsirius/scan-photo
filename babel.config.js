const isDev = process.env.NODE_ENV === "development";

module.exports = {
  // 执行顺序由右往左，所以先处理ts，再处理jsx,最后再试一下babel转换为低版本语法
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true,
        useBuiltIns: "usage", // 根据配置的浏览器兼容，以及代码中使用到的api进行引入polyfill按需添加
        corejs: 3, // 配置使用core-js低版本
      },
    ],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-proposal-private-methods", { loose: true }],
    isDev && require.resolve("react-refresh/babel"), // 配置react开发环境热替换
    ["@babel/plugin-proposal-decorators", { legacy: true }],
  ].filter(Boolean),
};
