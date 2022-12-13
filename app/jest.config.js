const config = {
  moduleNameMapper: {
    '.(css|less)$': '<rootDir>/config/CSSStub.js'
  },
  testEnvironment: 'jsdom'
}

module.exports = config