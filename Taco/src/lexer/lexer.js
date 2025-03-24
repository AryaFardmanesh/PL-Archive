import LexerTools from '../base/lexer.tools';
import LinkedList from '../base/ds/linkedlist';
import Kinds from '../base/lexer.kinds';
import Token from '../base/lexer.token';
import { errors } from '../base/lexer.errors';
import createErrorStyle from '../base/error-style';

class Lexer extends LexerTools {
	constructor( data = { path, program, error } ) {
		super();

		this.data = data;
		this.program = data.program;
		this.status = true;
		this.stream = new LinkedList();

		this.tokenizer();

		this.result = {
			path: data.path,
			program: this.stream.toArray(),
			error: data.error
		};
	}

	cursor = 0;

	line = 1;

	get char() {
		if ( this.cursor < this.program.length ) {
			return this.program[ this.cursor ];
		}
		return '\0';
	}

	killProcess( message = '' ) {
		this.data.error = createErrorStyle( this.data.path, this.line, message );
		this.status = false;
	}

	createToken( kind, value, raw, start = this.cursor, line = this.line ) {
		const node = new Token( kind, value, raw, start, line );
		this.stream.push( node );
	}

	tokenizer() {
		__process__ : while ( this.status ) {
			if ( this.char === '\0' ) {
				this.createToken( Kinds.EOF, '\0', '\0' );
				break;
			}else if ( this.char === ' ' || this.char === '\t' ) {
				this.cursor++;
				continue;
			}else if ( this.isNewline( this.char ) ) {
				this.cursor++;
				this.line++;
				continue;
			}else if ( this.char === ';' ) {
				this.createToken( Kinds.SEMICOLON, this.char, this.char );
				this.cursor++;
				continue;
			}else if ( this.char === '#' ) {
				this.skip( this.isNewline );
				continue;
			}else if ( this.char === '"' ) {
				const start = this.cursor;
				const strToken = this.getString();

				if ( strToken.closedEOF ) {
					this.killProcess( errors[ 0 /* SYNTAX_ERROR */ ] );
					break __process__;
				}

				this.createToken( Kinds.STRING, strToken.value, strToken.raw, start );

				continue;
			}else if ( this.char === '$' ) {
				const start = this.cursor;
				const strToken = this.getIdentifier();

				if ( !this.isIdentifier( strToken ) ) {
					this.killProcess( errors[ 2 /* BAD_ID_ERROR */ ] );
					break __process__;
				}

				this.createToken( Kinds.IDENTIFIER, strToken, strToken, start );

				continue;
			}else if ( this.isOperator( this.char ) ) {
				this.createToken( Kinds.OPERATOR, this.char, this.char );
				this.cursor++;

				continue;
			}else if ( this.isKeywordsTrack() ) {
				const start = this.cursor;
				const keywordStr = this.getKeywords();

				if ( !this.isKeywords( keywordStr ) ) {
					this.killProcess( errors[ 1 /* INVALID_ERROR */ ] );
					break __process__;
				}

				this.createToken( this.convertKeywordsToKind( keywordStr ), keywordStr, keywordStr, start );

				continue;
			}

			this.killProcess( errors[ 1 /* INVALID_ERROR */ ] );
			break __process__;
		}
	}
}

export default Lexer;
