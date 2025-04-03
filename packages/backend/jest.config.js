module.exports = {
    preset: 'ts-jest/presets/default-esm',  // Use ESM preset for ts-jest
    transform: {
      '^.+\\.[tj]sx?$': ['ts-jest', { useESM: true }]
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'], // Treat .ts and .tsx as ESM
    globals: {
      'ts-jest': {
        useESM: true, // Enable ESM
      },
    },
    moduleNameMapper: {
      'bun': '<rootDir>/__mocks__/bun.js',  // Optional: Mock 'bun' module to avoid errors
    },
  }
  