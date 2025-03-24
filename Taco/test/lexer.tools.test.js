import { describe, it, expect } from '@jest/globals';
import LexerTools from '../src/base/lexer.tools';
import { keywords } from '../src/base/lexer.keywords';

class Lexer extends LexerTools {
	constructor( code ) {
		super();

		this.program = code;
	}

	cursor = 0;

	get char() {
		if ( this.cursor < this.program.length ) {
			return this.program[ this.cursor ];
		}
		return '\0';
	}
}

describe( 'String Test Group', () => {
	it( 'Should parse string correctly - Unit 1', () => {
		const code = `"Hello world!"`;
		const actual = new Lexer( code ).getString();
		const expected = {
			value: `Hello world!`,
			raw: `"Hello world!"`,
			closedEOF: false
		};

		expect( expected ).toEqual( actual );
	} );

	it( 'Should parse string correctly - Unit 2', () => {
		const code = `"Hello\nworld!"`;
		const actual = new Lexer( code ).getString();
		const expected = {
			value: `Hello\nworld!`,
			raw: `"Hello\nworld!"`,
			closedEOF: false
		};

		expect( expected ).toEqual( actual );
	} );

	it( 'Should parse string correctly - Unit 3', () => {
		const code = `"Hello world!`;
		const actual = new Lexer( code ).getString();
		const expected = {
			value: `Hello world!`,
			raw: `"Hello world!`,
			closedEOF: true
		};

		expect( expected ).toEqual( actual );
	} );

	it( 'Should convert escape characters correctly - Unit 4', () => {
		const code = `"Hello\\nworld!"`;
		const actual = new Lexer( code ).getString();
		const expected = {
			value: `Hello\nworld!`,
			raw: `"Hello\\nworld!"`,
			closedEOF: false
		};

		expect( expected ).toEqual( actual );
	} );

	it( 'Should convert escape characters correctly - Unit 5', () => {
		const code = `"Hello\\\\world!"`;
		const actual = new Lexer( code ).getString();
		const expected = {
			value: `Hello\\world!`,
			raw: `"Hello\\\\world!"`,
			closedEOF: false
		};

		expect( expected ).toEqual( actual );
	} );

	it( 'Should convert escape characters correctly - Unit 6', () => {
		const code = `"Hello\\nworld!`;
		const actual = new Lexer( code ).getString();
		const expected = {
			value: `Hello\nworld!`,
			raw: `"Hello\\nworld!`,
			closedEOF: true
		};

		expect( expected ).toEqual( actual );
	} );
} );

describe( 'Identifier Test Group', () => {
	it( 'Should parse identifier correctly - Unit 1', () => {
		const code = `$test`;
		const actual = new Lexer( code ).getIdentifier();
		const expected = '$test';

		expect( expected ).toBe( actual );
	} );

	it( 'Should parse identifier correctly - Unit 2', () => {
		const code = `$test hello`;
		const actual = new Lexer( code ).getIdentifier();
		const expected = '$test';

		expect( expected ).toBe( actual );
	} );

	it( 'Should parse identifier correctly - Unit 3', () => {
		const code = `test hello`;
		const actual = new Lexer( code ).getIdentifier();
		const expected = 'test';

		expect( expected ).toBe( actual );
	} );

	it( 'Should parse identifier correctly - Unit 4', () => {
		const code = `$test $hello`;
		const actual = new Lexer( code ).getIdentifier();
		const expected = '$test';

		expect( expected ).toBe( actual );
	} );

	it( 'Should parse identifier correctly - Unit 5', () => {
		const code = `$test$hello`;
		const actual = new Lexer( code ).getIdentifier();
		const expected = '$test';

		expect( expected ).toBe( actual );
	} );

	it( 'Should parse identifier correctly - Unit 6', () => {
		const code = `$_t_e_s_t_`;
		const actual = new Lexer( code ).getIdentifier();
		const expected = '$_t_e_s_t_';

		expect( expected ).toBe( actual );
	} );

	it( 'Should parse identifier correctly - Unit 7', () => {
		const code = `$_`;
		const actual = new Lexer( code ).getIdentifier();
		const expected = '$_';

		expect( expected ).toBe( actual );
	} );

	it( 'Should parse identifier correctly - Unit 8', () => {
		const code = `$TEST`;
		const actual = new Lexer( code ).getIdentifier();
		const expected = '$TEST';

		expect( expected ).toBe( actual );
	} );

	it( 'Should parse identifier correctly - Unit 9', () => {
		const code = `$x`;
		const actual = new Lexer( code ).getIdentifier();
		const expected = '$x';

		expect( expected ).toBe( actual );
	} );
} );

describe( 'Comments Test Group', () => {
	it( 'Should skip the comment correctly - Unit 1', () => {
		const code = `# This is a comment.`;
		const lexer = new Lexer( code );
		lexer.skip( '\0' );

		const actual = lexer.cursor;
		const expected = code.length;

		expect( expected ).toBe( actual );
	} );

	it( 'Should skip the comment correctly - Unit 2', () => {
		const code = `# This is a comment.\nHello`;
		const lexer = new Lexer( code );
		lexer.skip( '\n' );

		const actual = lexer.cursor;
		const expected = code.indexOf( '\n' );

		expect( expected ).toBe( actual );
	} );

	it( 'Should skip the comment correctly - Unit 3', () => {
		const code = `# This is a comment.\n`;
		const lexer = new Lexer( code );

		const actual = lexer.skip( lexer.isNewline );
		const expected = '# This is a comment.';

		expect( expected ).toBe( actual );
	} );

	it( 'Should skip the comment correctly - Unit 4', () => {
		const code = `# This is a comment.\r`;
		const lexer = new Lexer( code );

		const actual = lexer.skip( lexer.isNewline );
		const expected = '# This is a comment.';

		expect( expected ).toBe( actual );
	} );

	it( 'Should skip the comment correctly - Unit 5', () => {
		const code = `# This is a comment.\nTest`;
		const lexer = new Lexer( code );

		const actual = lexer.skip( lexer.isNewline );
		const expected = '# This is a comment.';

		expect( expected ).toBe( actual );
	} );

	it( 'Should skip the comment correctly - Unit 6', () => {
		const code = `# This is a comment.\tTest`;
		const lexer = new Lexer( code );

		const actual = lexer.skip( '\t' );
		const expected = '# This is a comment.';

		expect( expected ).toBe( actual );
	} );
} );

describe( 'Keywords Test Group', () => {
	it( 'Should get the keywords correctly - Unit 1', () => {
		for ( const keyword of keywords ) {
			const actual = new Lexer( keyword ).getKeywords();
			const expected = keyword;
	
			expect( expected ).toBe( actual );
		}
	} );

	it( 'Should get the keywords correctly - Unit 2', () => {
		const code = `print print`;
		const actual = new Lexer( code ).getKeywords();
		const expected = 'print';

		expect( expected ).toBe( actual );
	} );

	it( 'Should get the keywords correctly - Unit 3', () => {
		const code = `print"print`;
		const actual = new Lexer( code ).getKeywords();
		const expected = 'print';

		expect( expected ).toBe( actual );
	} );

	it( 'Should get the keywords correctly - Unit 4', () => {
		const code = `var\nprint`;
		const actual = new Lexer( code ).getKeywords();
		const expected = 'var';

		expect( expected ).toBe( actual );
	} );

	it( 'Should get the keywords correctly - Unit 5', () => {
		const code = `nokeyword`;
		const actual = new Lexer( code ).getKeywords();
		const expected = 'nokeyword';

		expect( expected ).toBe( actual );
	} );

	it( 'Should get the keywords correctly - Unit 6', () => {
		const code = `nokeyword print`;
		const actual = new Lexer( code ).getKeywords();
		const expected = 'nokeyword';

		expect( expected ).toBe( actual );
	} );

	it( 'Should detect the keywords track - Unit 7', () => {
		const code = `print`;
		const actual = new Lexer( code ).isKeywordsTrack();
		const expected = true;

		expect( expected ).toBe( actual );
	} );
} );
