module.exports = {
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest'
    },
    transformIgnorePatterns: [
      'node_modules/(?!(axios|react-markdown|remark-*|rehype-*)/)'
    ],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: [
      '<rootDir>/src/tests/setup/setupTests.js'
    ],
    testEnvironment: 'jsdom',
    moduleDirectories: ['node_modules', 'src']
  };