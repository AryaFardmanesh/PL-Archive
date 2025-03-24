import readline from 'node:readline/promises';
import { stdin } from 'node:process';

import CodeGenKinds from "./codegen.kinds";
import MemoryBuffer from "./memory/buffer";
import MemoryStruct from "./memory/memory.struct";
import { errors } from "./runtime.errors";

class RuntimeTools {
	async print_() {
		this.cursor++;

		let buff = null;

		if ( this.token === CodeGenKinds.IDENTIFIER ) {
			this.cursor++;
			buff = this.memory.fetch( this.token );

			if ( buff === null ) {
				this.killProcess( errors[ 0 ].replaceAll( '$NAME', this.token ) /* REFERENCE_ERROR */ );
				return;
			}
		}else {
			this.cursor++;
			buff = this.token;
		}

		if ( buff instanceof MemoryStruct ) {
			for ( const byte of buff.buff.read() ) {
				process.stdout.write( String.fromCharCode( byte ) );
			}
		}else {
			process.stdout.write( buff );
		}

		this.cursor++;
	}

	async input_() {
		this.cursor += 2;
		const id = this.token;
		this.cursor++;

		const mem = this.memory.fetch( id );

		if ( mem === null ) {
			this.killProcess( errors[ 0 ].replaceAll( '$NAME', id ) /* REFERENCE_ERROR */ );
			return;
		}else if ( mem.type !== CodeGenKinds.STRING ) {
			this.killProcess( errors[ 2 ].replaceAll( '$NAME', id ) /* REFERENCE_ERROR */ );
			return;
		}

		const buff = mem.buff;

		const stdinStream = readline.createInterface( stdin );
		const result = await stdinStream.question( '' );
		stdinStream.close();

		buff.realloc( result, result.length );
	}

	async var_() {
		this.cursor++;
		const varType = this.token;
		this.cursor++;
		const varId = this.token;
		this.cursor++;
		this.cursor++;
		const varVal = this.token;
		this.cursor++;

		let buff = null;

		if ( varType === CodeGenKinds.STRING ) {
			buff = new MemoryBuffer( varVal, varVal.length );
		}else if ( varType === CodeGenKinds.BOOL ) {
			const byteValue = varVal === 'true' ? 0x1 : 0x0;
			buff = new MemoryBuffer( byteValue, 1 );
		}

		this.memory.malloc( varId, varType, buff );
	}

	async move_() {
		this.cursor++;
		this.cursor++;
		const id_1 = this.token;
		this.cursor++;
		this.cursor++;
		const id_2 = this.token;
		this.cursor++;

		const mem_1 = this.memory.fetch( id_1 );
		const mem_2 = this.memory.fetch( id_2 );

		if ( mem_1 === null ) {
			this.killProcess( errors[ 0 ].replaceAll( '$NAME', id_1 ) /* REFERENCE_ERROR */ );
			return;
		}
		if ( mem_2 === null ) {
			this.killProcess( errors[ 0 ].replaceAll( '$NAME', id_2 ) /* REFERENCE_ERROR */ );
			return;
		}

		const buff_2 = mem_2.buff.read();

		let __buff_bytes_stream__ = '';
		for ( const byte of buff_2 ) {
			__buff_bytes_stream__ += String.fromCharCode( byte );
		}
		mem_1.buff.realloc( __buff_bytes_stream__, __buff_bytes_stream__.length );
	}
}

export default RuntimeTools;
