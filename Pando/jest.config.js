module.exports = {
	testEnvironment: 'node',

	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$',

	moduleFileExtensions: [ 'js' ],

	transform: {
		'^.+\\.jsx?$': 'babel-jest',
	},
};