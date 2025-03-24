import CodeGenTools from "../base/codegen.tools";
import Queue from "../base/ds/queue";
import { errors } from "../base/codegen.errors";
import createErrorStyle from "../base/error-style";

class CodeGen extends CodeGenTools {
	constructor( data = { path, program, error } ) {
		super();

		this.data = data;
		this.program = data.program;
		this.status = true;
		this.current = this.program.right;

		this.gen();

		const stream = this.programStram.toArray();

		this.result = {
			path: data.path,
			program: stream,
			error: data.error
		};
	}

	next() {
		this.current = this.current.right;
	}

	killProcess( message = '' ) {
		this.data.error = createErrorStyle( this.data.path, 'Unknow', message );
		this.status = false;
	}

	gen() {
		__process__ : while ( this.status ) {
			if ( this.current === null ) {
				break __process__;
			}else if ( this.isStatement( this.current ) ) {
				this.createStatement();
				continue;
			}

			this.killProcess( errors[ 0 ] /* UNEXPECTED_ERROR */ );
			break __process__;
		}
	}
}

export default CodeGen;
