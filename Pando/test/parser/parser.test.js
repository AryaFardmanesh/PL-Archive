const parser = require('./../../src/parser/parser');
const Token = require('./../../src/var/token');

describe(`Print statement - Gruop`, () => {
	it(`should get correct syntax - Unit 1`, () => {
		const tokens = [
			new Token('keyword', 'print'),
			new Token('string', 'Hello world!'),
			new Token('semicolon', ';'),
			new Token('EOF', 'EOF')
		];
		const actual = parser(tokens).isError;
		const expected = false;

		expect(actual).toEqual(expected);
	});

	it(`should get correct syntax - Unit 2`, () => {
		const tokens = [
			new Token('keyword', 'print'),
			new Token('int', '15'),
			new Token('semicolon', ';'),
			new Token('EOF', 'EOF')
		];
		const actual = parser(tokens).isError;
		const expected = false;

		expect(actual).toEqual(expected);
	});

	it(`should get correct syntax - Unit 3`, () => {
		const tokens = [
			new Token('keyword', 'print'),
			new Token('float', '1.5'),
			new Token('semicolon', ';'),
			new Token('EOF', 'EOF')
		];
		const actual = parser(tokens).isError;
		const expected = false;

		expect(actual).toEqual(expected);
	});

	it(`should get correct syntax - Unit 4`, () => {
		const tokens = [
			new Token('keyword', 'print'),
			new Token('bool', 'true'),
			new Token('semicolon', ';'),
			new Token('EOF', 'EOF')
		];
		const actual = parser(tokens).isError;
		const expected = false;

		expect(actual).toEqual(expected);
	});

	it(`should get correct syntax - Unit 5`, () => {
		const tokens = [
			new Token('keyword', 'print'),
			new Token('char', 'A'),
			new Token('semicolon', ';'),
			new Token('EOF', 'EOF')
		];
		const actual = parser(tokens).isError;
		const expected = false;

		expect(actual).toEqual(expected);
	});

	it(`should get correct syntax - Unit 6`, () => {
		const tokens = [
			new Token('keyword', 'print'),
			new Token('null', 'null'),
			new Token('semicolon', ';'),
			new Token('EOF', 'EOF')
		];
		const actual = parser(tokens).isError;
		const expected = false;

		expect(actual).toEqual(expected);
	});

	it(`should get error syntax - Unit 7`, () => {
		const tokens = [
			new Token('keyword', 'print'),
			new Token('null', 'null'),
			new Token('EOF', 'EOF')
		];
		const actual = parser(tokens).isError;
		const expected = true;

		expect(actual).toEqual(expected);
	});

	it(`should get error syntax - Unit 8`, () => {
		const tokens = [
			new Token('keyword', 'print'),
			new Token('keyword', 'print'),
			new Token('semicolon', ';'),
			new Token('EOF', 'EOF')
		];
		const actual = parser(tokens).isError;
		const expected = true;

		expect(actual).toEqual(expected);
	});
});