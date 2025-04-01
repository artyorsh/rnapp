const esModules = [
  'react-native',
  '@react-native',
  '@react-navigation',
];

module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/src/service/log/log.service.mock.ts',
    '<rootDir>/src/service/navigation/navigation.service.mock.ts',
    '<rootDir>/src/service/session/session.service.mock.ts',
    '<rootDir>/src/service/user/user.service.mock.ts',
  ],
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
  testMatch: [
    '<rootDir>/src/**/*.spec.(ts|tsx)',
  ],
};
