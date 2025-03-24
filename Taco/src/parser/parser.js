import parserKinds from "../base/parser.kinds";
import LexerKinds from "../base/lexer.kinds";
import ParserTools from "../base/parser.tools";
import ParserTree from "../base/parser.tree";
import createErrorStyle from "../base/error-style";
import { errors } from "../base/parser.errors";

class Parser extends ParserTools {
	constructor( data = { path, program, error } ) {
		super();

		this.data = data;
		this.program = data.program;
		this.status = true;
		this.stream = new ParserTree( parserKinds.ROOT );
		this.current = this.stream;

		this.parse();

		this.result = {
			path: data.path,
			program: this.stream,
			error: data.error
		};

	}

	cursor = 0;

	get token() {
		if ( this.cursor < this.program.length ) {
			return this.program[ this.cursor ];
		}
		return this.program[ this.program.length - 1 ];
	}

	peek( index ) {
		index += this.cursor;
		if ( index >= 0 && index < this.program.length ) {
			return this.program[ index ];
		}
		return this.program[ this.program.length - 1 ];
	}

	killProcess( message = '' ) {
		this.data.error = createErrorStyle( this.data.path, this.token.line, message );
		this.status = false;
	}

	parse() {
		__process__ : while ( this.status ) {
			if ( this.token.kind === LexerKinds.EOF ) {
				break;
			}else if ( this.isStatement( this.token ) ) {
				this.createStatement();
				continue;
			}else if ( this.token.kind === LexerKinds.IDENTIFIER && this.isOperator( this.peek( 1 ), '=' ) ) {
				const node = this.statements.reassignVar_();
				this.appendNode( parserKinds.STATEMENT, node );
				continue;
			}

			this.killProcess( errors[ 5 ] /* INVALID_STATEMENT_ERROR */ );
			break __process__;
		}
	}
}

export default Parser;
