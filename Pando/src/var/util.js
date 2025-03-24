const errorList = require("./errorList");
const Token = require("./token");
const Node = require("./node");

module.exports = function () {
	return {
		position: 0,

		line: 1,

		status: true,

		source: '',

		tokens: [],

		result: {},

		errorList: errorList,

		get char() {
			if ( this.position < this.source.length )
				return this.source[ this.position ];
			return '\0';
		},

		get currentToken() {
			if ( this.position < this.tokens.length )
				return this.tokens[ this.position ];
			// This return EOF token.
			return this.tokens[ this.tokens.length - 1 ];
		},

		peek: function ( index = 0 ) {
			index = index + this.position;
			if ( index < this.source.length )
				return this.source[ index ];
			return '\0';
		},

		peekToken: function ( index = 0 ) {
			index = index + this.position;
			if ( index < this.tokens.length )
				return this.tokens[ index ];
			// This return EOF token.
			return this.tokens[ this.tokens.length - 1 ];
		},

		stopProcess: function ( message = '' ) {
			this.status = false;
			this.source = '';
			this.result.isError = true;
			this.result.errorMessage = message;
		},

		appendCharToSource: function ( ch = this.char ) {
			this.result.source += ch;
		},

		appendToken: function ( id, value ) {
			const newToken = new Token( id, value, this.line );
			this.result.tokens.push( newToken );
		},

		appendNode: function ( mid, right, left ) {
			const newNode = new Node( mid, right, left );
			this.result.tokens.push( newNode );
		},

		appendOwnNode: function ( node ) {
			this.result.tokens.push( node );
		},

		skipSingleComment: function () {
			while ( true ) {
				if ( this.char === '\n' || this.char === '\0' ) {
					this.position++;
					break;
				}
				this.position++;
			}
		},

		skipMultiLineComment: function () {
			const startLine = this.line;

			while ( true ) {
				if ( this.char === '*' && this.peek( 1 ) === '/' ) {
					this.position += 2;
					break;
				}else if ( this.char === '\0' ) {
					const errorHelper = ` <helper type="Syntax-Error" Line="${startLine}" />`;
					this.stopProcess( errorList[0] + errorHelper );
					break;
				}else if ( this.char === '\n' ) {
					this.line++;
					this.appendCharToSource();
					this.position++;
					continue
				}

				this.position++;
			}
		},

		getStringTrack: function () {
			const startLine = this.line;
			let str = '';
			this.position++;

			while ( true ) {
				if ( this.char === '"' ) {
					this.position++;
					break;
				}else if ( this.char === '\n' ) {
					this.line++;
					str += this.char;
					this.position++;
					continue;
				}else if ( this.char === '\\' ) {
					this.position++;
					const escpaeChar = this.char;
					this.position++;
					str += this.convertEscapeChar( escpaeChar );
				}else if ( this.char === '\0' ) {
					const errorHelper = ` <helper type="Syntax-Error" Line="${startLine}" />`;
					this.stopProcess( errorList[1] + errorHelper );
					break;
				}

				str += this.char;
				this.position++;
			}

			return str;
		},

		getCharTrack: function () {
			this.position++;
			let getCh = this.char;
			if ( getCh === '\\' ) {
				this.position++;
				getCh = this.convertEscapeChar( this.char );
			}
			this.position++;

			if ( this.char !== '\'' ) {
				const errorHelper = ` <helper type="Syntax-Error" Line="${this.line}" />`;
				this.stopProcess( errorList[2] + errorHelper );
			}
			this.position++;

			return getCh;
		},

		convertEscapeChar: function ( ch ) {
			switch ( ch ) {
				case '\\': return '\\';
				case 'n' : return '\n';
				case 'r' : return '\r';
				case 't' : return '\t';
				case '"' : return '\"';
				case '\'': return '\'';
				default: return ch;
			}
		},

		isDigit: function ( ch ) {
			ch = ch.codePointAt( 0 );

			if ( ch >= 48 && ch <= 57 )
				return true;
			return false;
		},

		isNumberTrack: function () {
			if ( this.isDigit( this.char ) )
				return true;

			if ( this.char === '+' || this.char === '-' )
				if ( this.isDigit( this.peek( 1 ) ) )
					return true;

			return false;
		},

		getNumber: function () {
			let
				type 	= 'int'	,
				num 	= ''
			;

			if ( this.char === '+' || this.char === '-' ) {
				num += this.char;
				this.position++;
			}

			while ( true ) {
				if ( this.char === '.' ) {
					if ( type === 'float' ) {
						const errorHelper = ` <helper type="Syntax-Error" Line="${this.line}" />`;
						this.stopProcess( errorList[3] + errorHelper );
					}

					type = 'float';
					num += this.char;
					this.position++;
					continue;
				}else if ( !this.isDigit( this.char ) ) {
					break;
				}

				num += this.char;
				this.position++;
			}

			return { value: num, type: type };
		},

		isSeparator: function ( ch ) {
			ch = ch.codePointAt( 0 );

			if ( ch >= 0 && ch <= 47 )
				return true;
			else if ( ch >= 58 && ch <= 64 )
				return true;
			else if ( ch >= 91 && ch <= 96 )
				return true;
			else if ( ch >= 123 && ch <= 127 )
				return true;
			else
				return false;
		},

		handelGotKey: function ( key ) {
			const keywords = [ 'print' ];

			if ( keywords.includes( key ) ) {
				this.appendToken( 'keyword', key );
			}else if ( key === 'null' ) {
				this.appendToken( key, key );
			}else if ( key === 'true' || key === 'false' ) {
				this.appendToken( 'bool', key );
			}else {
				// It's anonymous keyword token.
				const errorHelper = ` <helper type="Syntax-Error" Token="${key}" Line="${this.line}" />`;
				this.stopProcess( errorList[4] + errorHelper );
			}
		},

		isEOFToken: function ( tk ) {
			if ( tk.id === 'EOF' && tk.value === 'EOF' )
				return true;
			return false;
		},

		isLiteralsToken: function ( tk ) {
			switch ( tk.id ) {
				case 'int': return true;
				case 'float': return true;
				case 'bool': return true;
				case 'char': return true;
				case 'string': return true;
				case 'null': return true;
				default: return false;
			}
		},

		handelPrintSt: function () {
			this.position++;

			if ( this.isLiteralsToken( this.currentToken ) ) {
				const value = this.currentToken;
				this.position++;

				if ( this.currentToken.id !== 'semicolon' ) {
					const errorHelper = ` <helper type="Syntax-Error" Line="${this.peek( -1 ).line}" />`;
					this.stopProcess( errorList[5] + errorHelper );
					return;
				}

				this.position++;

				const valueNode = new Node( value.id, value.value );
				const printNode = new Node( 'print', valueNode );
				this.appendOwnNode( printNode );
			}else {
				const errorHelper = ` <helper type="Syntax-Error & Type-Error" Line="${this.peek( -1 ).line}" />`;
				this.stopProcess( errorList[6] + errorHelper );
			}
		}
	};
}