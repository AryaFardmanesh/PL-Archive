const preprocessor = require('./../../src/preprocessor/preprocessor');

describe(`Remove all single comment - Gruop`, () => {
	it(`should remove all single line comments - Unit 1`, () => {
		const txt = `Hello world! $ This is a single line comment`;
		const actual = preprocessor(txt).source;
		const expected = `Hello world! `;

		expect(actual).toBe(expected);
	});

	it(`should remove all single line comments - Unit 2`, () => {
		const txt = `Hello world! $ This is a single line comment\n`;
		const actual = preprocessor(txt).source;
		const expected = `Hello world! `;

		expect(actual).toBe(expected);
	});

	it(`should remove all single line comments - Unit 3`, () => {
		const txt = `Hello world! $ This is a single line comment\n$ This is a comment to.`;
		const actual = preprocessor(txt).source;
		const expected = `Hello world! `;

		expect(actual).toBe(expected);
	});

	it(`should remove all single line comments - Unit 4`, () => {
		const txt = `$ comment\nHello world!$comment\n $ comment`;
		const actual = preprocessor(txt).source;
		const expected = `Hello world! `;

		expect(actual).toBe(expected);
	});
});

describe(`Remove all multi line comment - Gruop`, () => {
	it(`should remove all multi line comments - Unit 1`, () => {
		const txt = `Hello world! /* This is a multi line comment */`;
		const actual = preprocessor(txt).source;
		const expected = `Hello world! `;

		expect(actual).toBe(expected);
	});

	it(`should remove all multi line comments - Unit 2`, () => {
		const txt = `Hello world! /* This is a multi line comment */Hello test`;
		const actual = preprocessor(txt).source;
		const expected = `Hello world! Hello test`;

		expect(actual).toBe(expected);
	});

	it(`should remove all multi line comments - Unit 3`, () => {
		const txt = `/*test*/Hello world! /* This is a multi line comment */Hello test/*test*/`;
		const actual = preprocessor(txt).source;
		const expected = `Hello world! Hello test`;

		expect(actual).toBe(expected);
	});

	it(`should remove all multi line comments - Unit 4`, () => {
		const txt = `Hello world! /* This is a multi line comment */\nHello test`;
		const actual = preprocessor(txt).source;
		const expected = `Hello world! \nHello test`;

		expect(actual).toBe(expected);
	});
});

describe(`Multi line commnet error test - Gruop`, () => {
	it(`should get error - Unit 1`, () => {
		const txt = `Hello world! /* This is a multi line comment `;
		const actual = preprocessor(txt).isError;
		const expected = true;

		expect(actual).toBe(expected);
	});

	it(`should get error and show line - Unit 2`, () => {
		const txt = `Hello world! /* This is a multi line comment `;
		const actual = preprocessor(txt).errorMessage.includes(`Line="1"`);
		const expected = true;

		expect(actual).toBe(expected);
	});

	it(`should get error and show line - Unit 3`, () => {
		const txt = `Hello world!\n/* This is a multi line comment `;
		const actual = preprocessor(txt).errorMessage.includes(`Line="2"`);
		const expected = true;

		expect(actual).toBe(expected);
	});

	it(`should get error and show line - Unit 4`, () => {
		const txt = `Hello world!\n/* This is a multi line comment \n`;
		const actual = preprocessor(txt).errorMessage.includes(`Line="2"`);
		const expected = true;

		expect(actual).toBe(expected);
	});
});

describe(`String behaviour - Gruop`, () => {
	it(`should get string escape char - Unit 1`, () => {
		const txt = `"hello\\\\world!"`;
		const actual = preprocessor(txt).source;
		const expected = `"hello\\world!"`;

		expect(actual).toBe(expected);
	});

	it(`should get string escape char - Unit 2`, () => {
		const txt = `"hello\\nworld!"`;
		const actual = preprocessor(txt).source;
		const expected = `"hello\nworld!"`;

		expect(actual).toBe(expected);
	});

	it(`should get string escape char - Unit 3`, () => {
		const txt = `"hello\\rworld!"`;
		const actual = preprocessor(txt).source;
		const expected = `"hello\rworld!"`;

		expect(actual).toBe(expected);
	});

	it(`should get string escape char - Unit 4`, () => {
		const txt = `"hello\\tworld!"`;
		const actual = preprocessor(txt).source;
		const expected = `"hello\tworld!"`;

		expect(actual).toBe(expected);
	});

	it(`should get string escape char - Unit 5`, () => {
		const txt = `"hello\\"tworld!"`;
		const actual = preprocessor(txt).source;
		const expected = `"hello\"tworld!"`;

		expect(actual).toBe(expected);
	});

	it(`should get string escape char - Unit 6`, () => {
		const txt = `"hello\\'tworld!"`;
		const actual = preprocessor(txt).source;
		const expected = `"hello\'tworld!"`;

		expect(actual).toBe(expected);
	});

	it(`should get string escape char - Unit 7`, () => {
		const txt = `"hello\\world!"`;
		const actual = preprocessor(txt).source;
		const expected = `"helloworld!"`;

		expect(actual).toBe(expected);
	});
});

describe(`String behaviour, commnet in string - Gruop`, () => {
	it(`should get string like string - Unit 1`, () => {
		const txt = `"// Hello world!"`;
		const actual = preprocessor(txt).source;
		const expected = `"// Hello world!"`;

		expect(actual).toBe(expected);
	});

	it(`should get string like string - Unit 2`, () => {
		const txt = `"/* Hello world! */"`;
		const actual = preprocessor(txt).source;
		const expected = `"/* Hello world! */"`;

		expect(actual).toBe(expected);
	});
});