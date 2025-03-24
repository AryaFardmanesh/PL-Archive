import convertEscapeSequenceChar from "./escape-sequence-char";
import { keywords } from "./lexer.keywords";
import lexerKinds from "./lexer.kinds";

class LexerTools {
	isDigit( ch ) {
		if ( typeof ch !== 'string' ) {
			return false;
		}

		ch = ch.charCodeAt();

		if ( ch >= 48 && ch <= 57 ) {
			return true;
		}
		return false;
	}

	isAlphabet( ch ) {
		if ( typeof ch !== 'string' ) {
			return false;
		}

		ch = ch.charCodeAt();

		if ( ch >= 65 /* A */ && ch <= 90 /* Z */ ) {
			return true;
		}else if ( ch >= 97 /* a */ && ch <= 122 /* z */ ) {
			return true;
		}
		return false;
	}

	isSeparator( ch ) {
		if ( typeof ch !== 'string' ) {
			return false;
		}

		ch = ch.charCodeAt();

		if ( ch <= 47 ) {
			return true;
		}else if ( ch >= 58 && ch <= 64 ) {
			return true;
		}else if ( ch >= 91 && ch <= 96 ) {
			return true;
		}else if ( ch >= 123 ) {
			return true;
		}
		return false;
	}

	isNewline( ch ) {
		if ( typeof ch !== 'string' ) {
			return false;
		}

		ch = ch.charCodeAt();

		switch ( ch ) {
		case 10 /* LF=\n */:
		case 13 /* CRLF=\r */:
			return true
		default:
			return false
		}
	}

	isPartOfIdentifier( ch ) {
		if ( !this.isAlphabet( ch ) && !this.isDigit( ch ) && ch !== '_' ) {
			return false;
		}
		return true;
	}

	isIdentifier( id ) {
		if ( typeof id !== 'string' ) {
			return false;
		}
		if ( id.length <= 1 ) {
			return false;
		}

		id = id.slice( 1 );

		for ( let i = 0; i < id.length; i++ ) {
			const ch = id[ i ];

			if ( !this.isPartOfIdentifier( ch ) ) {
				return false;
			}
		}

		return true;
	}

	isKeywords( str ) {
		return keywords.includes( str );
	}

	isOperator( str ) {
		switch ( str ) {
		case '=':
			return true;
		default:
			return false;
		}
	}

	isIdentifierTrack() {
		if ( this.char === '$' ) {
			return true;
		}
		return false;
	}

	isKeywordsTrack() {
		for ( const keyword of keywords ) {
			if (
				this.program.startsWith( keyword, this.cursor ) &&
				this.isSeparator( this.program[ this.cursor + keyword.length ] || '\0' )
			) {
				return true;
			}
		}

		return false;
	}

	convertKeywordsToKind( keyword ) {
		if ( keyword === 'true' || keyword === 'false' ) {
			return lexerKinds.BOOL;
		}
		return lexerKinds.KEYWORD;
	}

	skip( until ) {
		let track = '';

		while ( true ) {
			if ( typeof until === 'string' && until === this.char ) {
				break;
			}else if ( typeof until === 'function' && until( this.char ) ) {
				break;
			}else if ( this.char === '\0' ) {
				break;
			}

			track += this.char;
			this.cursor++;
		}

		return track;
	}

	getIdentifier() {
		let id = this.char;
		this.cursor++;

		while ( true ) {
			if ( !this.isPartOfIdentifier( this.char ) ) {
				break;
			}

			id += this.char;
			this.cursor++;
		}

		return id;
	}

	getString() {
		let value = '', raw = this.char, closedEOF = false;
		this.cursor++;

		while ( true ) {
			if ( this.char === '"' ) {
				raw += this.char;
				this.cursor++;

				break;
			}else if ( this.char === '\0' ) {
				closedEOF = true;
				break;
			}else if ( this.char === '\\' ) {
				raw += this.char;
				this.cursor++;

				const ch = convertEscapeSequenceChar( this.char );

				value += ch;
				raw += this.char;
				this.cursor++;

				continue;
			}

			value += this.char;
			raw += this.char;

			this.cursor++;
		}

		return { value, raw, closedEOF };
	}

	getKeywords() {
		let keyword = '';

		while ( true ) {
			if ( this.isSeparator( this.char ) ) {
				break;
			}

			keyword += this.char;
			this.cursor++;
		}

		return keyword;
	}
}

export default LexerTools;
