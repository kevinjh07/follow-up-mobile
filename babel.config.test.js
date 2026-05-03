module.exports = {
  presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@app': './src/app',
          '@core': './src/core',
          '@features': './src/features',
          '@shared': './src/shared',
          '@navigation': './src/navigation',
        },
      },
    ],
  ],
};
