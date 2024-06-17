/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "^.+\\.(j|t)sx?$": "ts-jest",
  },

  testMatch: ["**/*.test.(j|t)s"],
};
