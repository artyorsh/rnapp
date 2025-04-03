const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

const esModules = [
  'react-native',
  '@react-native',
  '@react-navigation',
];

const tscPaths = Object.entries(compilerOptions.paths)
  .filter(([key]) => key !== 'react')
  .reduce((acc, [key, value]) => ({...acc, [key]: value }), {})

module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/src/service/log/log.service.mock.ts',
    '<rootDir>/src/service/navigation/navigation.service.mock.ts',
    '<rootDir>/src/service/session/session.service.mock.ts',
    '<rootDir>/src/service/user/user.service.mock.ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper(tscPaths, { prefix: '<rootDir>' }),
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
  testMatch: [
    '<rootDir>/src/**/*.spec.(ts|tsx)',
  ],
};
