import RuntimeTools from '../base/runtime.tools';
import RuntimeKinds from '../base/runtime.kinds';
import CodeGenKinds from '../base/codegen.kinds';
import createErrorStyle from './../base/error-style';
import Memory from "../base/memory/memory";
import { errors } from '../base/runtime.errors';

class Runtime extends RuntimeTools {
	constructor( data = { path, program, error } ) {
		super();

		this.path = data.path;
		this.program = data.program;
		this.status = true;
		this.error = data.error;
		this.exit = 0;

		this.memory = new Memory();

		this.result = {
			path: data.path,
			error: data.error,
			exit: this.exit
		};
	}

	cursor = 0;

	get token() {
		if ( this.cursor < this.program.length ) {
			return this.program[ this.cursor ];
		}
		return RuntimeKinds.EXIT;
	}

	killProcess( message = '' ) {
		this.result.error = createErrorStyle( this.path, '?', message );
		this.status = false;
		this.result.exit = 1;
	}

	async execute() {
		__process__ : while ( this.status ) {
			if ( this.token === RuntimeKinds.EXIT ) {
				break __process__;
			}else if ( this.token === CodeGenKinds.PRINT ) {
				await this.print_();
				continue;
			}else if ( this.token === CodeGenKinds.VAR ) {
				await this.var_();
				continue;
			}else if ( this.token === CodeGenKinds.INPUT ) {
				await this.input_();
				continue;
			}else if ( this.token === CodeGenKinds.MOVE ) {
				await this.move_();
				continue;
			}

			this.killProcess( errors[ 1 ] /* INVALID_DIRECTIVE */ );
			break __process__;
		}
	}
}

export default Runtime;
