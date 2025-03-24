import Queue from "./ds/queue";
import { errors } from "./codegen.errors";
import ParserKinds from "./parser.kinds";
import CodeGenKinds from "./codegen.kinds";

class CodeGenTools {
	constantStream = new Queue();

	programStram = new Queue();

	appendProgram( stream ) {
		if ( Array.isArray( stream ) ) {
			for ( const chunk of stream ) {
				this.programStram.enqueue( chunk );
			}
			return;
		}

		this.programStram.enqueue( stream );
	}

	isStatement( node ) {
		return node?.head === ParserKinds.STATEMENT;
	}

	statements = {
		_var: ( node ) => {
			const left = node.left;
			const right = node.right;

			const typeVar = left.left;
			const idVar = left.right;

			this.appendProgram( [ CodeGenKinds.VAR, typeVar, idVar ] );

			const typeVal = right.left;
			const valVar = right.right;

			if ( typeVal === ParserKinds.IDENTIFIER ) {
				this.appendProgram( [ CodeGenKinds.IDENTIFIER, valVar ] );
			}else {
				this.appendProgram( [ typeVal, valVar ] );
			}
		},

		_reassin: ( node ) => {
			const left = node.left;
			const right = node.right;

			this.appendProgram( [ CodeGenKinds.MOVE, CodeGenKinds.IDENTIFIER, left.right ] );

			if ( right.head === ParserKinds.IDENTIFIER ) {
				this.appendProgram( [ CodeGenKinds.IDENTIFIER, right.right ] );
			}else {
				this.appendProgram( [ right.head, right.right ] );
			}
		},

		_input: ( node ) => {
			const right = node.right;
			this.appendProgram( [ CodeGenKinds.INPUT, CodeGenKinds.IDENTIFIER, right.right ] );
		},

		_print: ( node ) => {
			const right = node.right;

			this.appendProgram( CodeGenKinds.PRINT );

			if ( right.head === ParserKinds.IDENTIFIER ) {
				this.appendProgram( [ CodeGenKinds.IDENTIFIER, right.right ] );
			}else {
				this.appendProgram( [ right.head, right.right ] );
			}
		},
	};

	createStatement() {
		const node = this.current.left;
		const hookname = '_' + node.head.toLowerCase();
		const hook = this.statements[ hookname ];

		if ( typeof hook !== 'function' ) {
			this.killProcess( errors[ 1 ] /* REFERENCE_ERROR */ );
			return;
		}

		hook( node );

		this.next();
	}
}

export default CodeGenTools;
