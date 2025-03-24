import LexerKinds from "./lexer.kinds";
import ParserKinds from "./parser.kinds";
import { type_keywords } from "./lexer.keywords";
import Tree from "./parser.tree";
import { errors } from "./parser.errors";

class ParserTools {
	isLiteral( tk ) {
		switch ( tk.kind ) {
		case LexerKinds.STRING:
		case LexerKinds.BOOL:
			return true;
		default:
			return false;
		}
	}

	isKeyword( tk, value = null ) {
		if ( tk.kind !== LexerKinds.KEYWORD ) {
			return false;
		}

		if ( value && tk.value !== value ) {
			return false;
		}

		return true;
	}

	isOperator( tk, value = null ) {
		if ( tk.kind !== LexerKinds.OPERATOR ) {
			return false;
		}

		if ( value && tk.value !== value ) {
			return false;
		}

		return true;
	}

	isTypeKeyword( tk, value = null ) {
		if ( tk.kind !== LexerKinds.KEYWORD ) {
			return false;
		}

		if ( value && tk.value === value ) {
			return true;
		}

		switch ( tk.value ) {
		case 'string':
		case 'bool':
			return true;
		default:
			return false;
		}
	}

	
	isStatement( tk, value = null ) {
		if ( !this.isKeyword( tk ) ) {
			return false;
		}

		if ( value && tk.value !== value ) {
			return false;
		}

		switch ( tk.value ) {
		case 'print':
		case 'input':
		case 'var':
			return true;
		default:
			return false;
		}
	}

	appendNode( head, left, right ) {
		const node = new Tree( head, left, right );
		this.current.right = node;
		this.current = this.current.right;
	}

	createNode( head, left, right ) {
		return new Tree( head, left, right );
	}

	statements = {
		_print: () => {
			this.cursor++;

			let rightNode = null;

			if ( this.token.kind === LexerKinds.IDENTIFIER ) {
				rightNode = this.createNode( ParserKinds.IDENTIFIER, null, this.token.value );
				this.cursor++;
			}else if ( this.isLiteral( this.token ) ) {
				let kind = null;
				if ( this.token.kind === LexerKinds.STRING ) {
					kind = ParserKinds.STRING
				}else if ( this.token.kind === LexerKinds.BOOL ) {
					kind = ParserKinds.BOOL
				}else {
					this.killProcess( errors[ 0 ] /* INVALID_TYPE_ERROR */ );
					return null;
				}

				rightNode = this.createNode( ParserKinds.LITERALS, kind, this.token.value );
				this.cursor++;
			}else {
				this.killProcess( errors[ 1 ] /* PRINT_ERROR */ );
				return null;
			}

			if ( this.token.kind !== LexerKinds.SEMICOLON ) {
				this.killProcess( errors[ 3 ] /* SEMICOLON_ERROR */ );
				return null;
			}
			this.cursor++;

			return this.createNode( ParserKinds.PRINT, null, rightNode );
		},

		_input: () => {
			this.cursor++;

			let rightNode = null;

			if ( this.token.kind === LexerKinds.IDENTIFIER ) {
				rightNode = this.createNode( ParserKinds.IDENTIFIER, null, this.token.value );
				this.cursor++;
			}else {
				this.killProcess( errors[ 2 ] /* INPUT_ERROR */ );
				return null;
			}

			if ( this.token.kind !== LexerKinds.SEMICOLON ) {
				this.killProcess( errors[ 3 ] /* SEMICOLON_ERROR */ );
				return null;
			}
			this.cursor++;

			return this.createNode( ParserKinds.INPUT, null, rightNode );
		},

		_var: () => {
			let leftNode = null;
			let rightNode = null;

			this.cursor++;

			if ( !this.isTypeKeyword( this.token ) ) {
				this.killProcess( errors[ 4 ] /* VAR_ERROR */ );
				return null;
			}

			let type = this.token.value;
			if ( type === 'string' ) {
				type = ParserKinds.STRING;
			}else if ( type === 'bool' ) {
				type = ParserKinds.BOOL;
			}else {
				this.killProcess( errors[ 0 ] /* INVALID_TYPE_ERROR */ );
				return null;
			}
			this.cursor++;

			if ( this.token.kind !== LexerKinds.IDENTIFIER ) {
				this.killProcess( errors[ 4 ] /* VAR_ERROR */ );
				return null;
			}
			let id = this.token.value;
			this.cursor++;

			leftNode = this.createNode( ParserKinds.VARINFO, type, id );

			if ( this.isOperator( this.token, "=" ) ) {
				this.cursor++;

				if ( !this.isLiteral( this.token ) ) {
					this.killProcess( errors[ 4 ] /* VAR_ERROR */ );
					return null;
				}

				let kind = null;
				if ( this.token.kind === LexerKinds.STRING ) {
					kind = ParserKinds.STRING
				}else if ( this.token.kind === LexerKinds.BOOL ) {
					kind = ParserKinds.BOOL
				}else {
					this.killProcess( errors[ 0 ] /* INVALID_TYPE_ERROR */ );
					return null;
				}

				if ( kind !== type ) {
					this.killProcess( errors[ 6 ] /* UNEXPECTED_TYPE_ERROR */ );
					return null;
				}

				rightNode = this.createNode( ParserKinds.LITERALS, kind, this.token.value );
				this.cursor++;
			}else {
				let value = null;

				if ( type === ParserKinds.STRING ) {
					value = "";
				}else if ( type === ParserKinds.BOOL ) {
					value = "false"
				}else {
					this.killProcess( errors[ 0 ] /* INVALID_TYPE_ERROR */ );
					return null;
				}

				rightNode = this.createNode( ParserKinds.LITERALS, type, value );
			}

			if ( this.token.kind !== LexerKinds.SEMICOLON ) {
				this.killProcess( errors[ 3 ] /* SEMICOLON_ERROR */ );
				return null;
			}
			this.cursor++;

			return this.createNode( ParserKinds.VAR, leftNode, rightNode );
		},

		reassignVar_: () => {
			let leftNode = null, rightNode = null;

			if ( this.token.kind === LexerKinds.IDENTIFIER ) {
				leftNode = this.createNode( ParserKinds.IDENTIFIER, null, this.token.value );
				this.cursor++;
			}else {
				this.killProcess( errors[ 7 ] /* UNEXPECTED_ERROR */ );
				return null;
			}

			if ( !this.isOperator( this.token, '=' ) ) {
				this.killProcess( errors[ 7 ] /* UNEXPECTED_ERROR */ );
				return null;
			}
			this.cursor++;

			if ( this.token.kind === LexerKinds.IDENTIFIER ) {
				rightNode = this.createNode( ParserKinds.IDENTIFIER, null, this.token.value );
				this.cursor++;
			}else if ( this.isLiteral( this.token ) ) {
				let kind = null;
				if ( this.token.kind === LexerKinds.STRING ) {
					kind = ParserKinds.STRING
				}else if ( this.token.kind === LexerKinds.BOOL ) {
					kind = ParserKinds.BOOL
				}else {
					this.killProcess( errors[ 0 ] /* INVALID_TYPE_ERROR */ );
					return null;
				}

				rightNode = this.createNode( ParserKinds.LITERALS, kind, this.token.value );
				this.cursor++;
			}else {
				this.killProcess( errors[ 7 ] /* UNEXPECTED_ERROR */ );
				return null;
			}

			if ( this.token.kind !== LexerKinds.SEMICOLON ) {
				this.killProcess( errors[ 3 ] /* SEMICOLON_ERROR */ );
				return null;
			}
			this.cursor++;

			return this.createNode( ParserKinds.REASSIN, leftNode, rightNode );
		}
	};

	createStatement() {
		const hook = this.statements[ '_' + this.token.value ];

		if ( typeof hook !== 'function' ) {
			this.killProcess( errors[ 5 ] /* INVALID_STATEMENT_ERROR */ );
			return;
		}

		const node = hook();

		if ( node === null ) {
			return;
		}

		this.appendNode( ParserKinds.STATEMENT, node );
	}
}

export default ParserTools;
