module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/testing/setup-tests.ts'],
  testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { configFile: './babel.config.test.js' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!react-native/|@react-native/|react-native-paper/|react-native-safe-area-context/|react-native-vector-icons/|@react-navigation/|@react-native-community/|expo/|@expo/|react-native-reanimated/|react-native-gesture-handler/|react-native-screens/|@gorhom/bottom-sheet/|react-native-gifted-charts/|msw/)',
  ],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^react-native$': '<rootDir>/src/testing/mocks/react-native.mock.js',
    '^react-native/(.*)$': '<rootDir>/src/testing/mocks/react-native.mock.js',
    '^react-native-paper$': '<rootDir>/src/testing/mocks/react-native-paper.mock.js',
    '^react-native-paper/(.*)$': '<rootDir>/src/testing/mocks/react-native-paper.mock.js',
    '^react-native-safe-area-context$': '<rootDir>/src/testing/mocks/react-native-safe-area-context.mock.js',
    '^react-native-safe-area-context/(.*)$': '<rootDir>/src/testing/mocks/react-native-safe-area-context.mock.js',
  },
  collectCoverageFrom: [
    'src/features/clinics/api/*.ts',
    'src/features/leads/api/*.ts',
    '!src/**/*.d.ts',
    '!src/testing/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
