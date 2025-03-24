const scanner = require('./../../src/scanner/scanner');
const Token = require('./../../src/var/token');

describe(`EOF tokens - Gruop`, () => {
	it(`should get EOF token - Unit 1`, () => {
		const code = ``;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});
});

describe(`String tokens - Gruop`, () => {
	it(`should get string and generate string token - Unit 1`, () => {
		const code = `"Hello world!"`;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('string', 'Hello world!'),
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});

	it(`should get string and generate string token - Unit 2`, () => {
		const code = `"Hello world!" "Hello" "TEST"`;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('string', 'Hello world!'),
			new Token('string', 'Hello'),
			new Token('string', 'TEST'),
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});
});

describe(`char tokens - Gruop`, () => {
	it(`should get char and generate char token - Unit 1`, () => {
		const code = `'a'`;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('char', 'a'),
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});

	it(`should get char and generate char token - Unit 2`, () => {
		const code = `'A' 'b' '\c'`;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('char', 'A'),
			new Token('char', 'b'),
			new Token('char', 'c'),
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});

	it(`should get scape char in char literal - Unit 3`, () => {
		const code = `'\\n'\n'\\r'\n'\\t'\n'\\"'\n'\\''\n'\\\\'\n`;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('char', '\n'),
			new Token('char', '\r'),
			new Token('char', '\t'),
			new Token('char', '"'),
			new Token('char', '\''),
			new Token('char', '\\'),
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});
});

describe(`number tokens - Gruop`, () => {
	it(`should get int and generate int token - Unit 1`, () => {
		const code = `13\n+14\n-1561`;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('int', '13'),
			new Token('int', '+14'),
			new Token('int', '-1561'),
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});

	it(`should get float and generate float token - Unit 2`, () => {
		const code = `2.6\n+1.4\n-15.61`;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('float', '2.6'),
			new Token('float', '+1.4'),
			new Token('float', '-15.61'),
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});

	it(`should get numbers and generate number token - Unit 3`, () => {
		const code = `26\n+1.4\n-15.61 15\n-4.16151`;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('int', '26'),
			new Token('float', '+1.4'),
			new Token('float', '-15.61'),
			new Token('int', '15'),
			new Token('float', '-4.16151'),
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});
});

describe(`boolean literal tokens - Gruop`, () => {
	it(`should get boolean and generate boolean token - Unit 1`, () => {
		const code = `true\n false\n true`;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('bool', 'true'),
			new Token('bool', 'false'),
			new Token('bool', 'true'),
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});
});

describe(`null literal tokens - Gruop`, () => {
	it(`should get null and generate null token - Unit 1`, () => {
		const code = `null\n null\n null`;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('null', 'null'),
			new Token('null', 'null'),
			new Token('null', 'null'),
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});
});

describe(`print tokens - Gruop`, () => {
	it(`should get print and generate keyword token - Unit 1`, () => {
		const code = `print\nprint print`;
		const actual = scanner(code).tokens;
		const expected = [
			new Token('keyword', 'print'),
			new Token('keyword', 'print'),
			new Token('keyword', 'print'),
			new Token('EOF', 'EOF')
		];

		expect(actual).toEqual(expected);
	});
});