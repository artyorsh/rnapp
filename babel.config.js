module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'tsconfig-paths-module-resolver',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
