module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/tests/styleMock.cjs',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
