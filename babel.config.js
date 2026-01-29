module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind", // ← this tells Babel to use NativeWind for JSX → no separate plugin needed
        },
      ],
    ],
    plugins: ["react-native-reanimated/plugin"], // keep this one (Reanimated needs it)
  };
};
