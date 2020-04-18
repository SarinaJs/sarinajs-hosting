module.exports = {
	name: 'sarina-hosting',
	verbose: true,
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testRegex: '.spec.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['src/**/*.(t|j)s'],
	coverageDirectory: 'test_result/coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'@sarina/hosting/(.*)': '<rootDir>/src/$1',
		'@sarina/hosting': '<rootDir>/src/index.ts',
	},
};
