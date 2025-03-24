function compiler( ast, exportPath ) {
	// Import modules
	const path = require( 'path' );
	const fs = require( 'fs' );
	// Import modules

	// Util
	const util = {
		position: 0,

		status: true,

		programBuffer: [],

		get token() {
			if ( this.position < ast.length )
				return ast[ this.position ];
			return ast[ ast.length - 1];
		},

		peek: function ( pos ) {
			const index = pos + this.position;
			if ( index < ast.length )
				return ast[ index ];
			return ast[ ast.length - 1];
		},

		write: async function ( byteBuffer ) {
			try {
				await fs.appendFileSync( exportPath, byteBuffer, 'binary' );
			}catch ( error ) {
				throw new Error( `Fatal Error: Cannot write to target file.\n${ error }` );
			}
		},

		clean: async function () {
			try {
				await fs.writeFileSync( exportPath, '', 'utf-8' );
			}catch ( error ) {
				throw new Error( `Fatal Error: Cannot clean to target file.\n${ error }` );
			}
		},

		byte: function ( data ) {
			if ( typeof data != 'number' ) {
				throw new TypeError( `Fatal Error: Cannot create byte code with non-numberic value.` );
			}

			const byteBuf = new ArrayBuffer( 1 );
			const view = new Uint8Array( byteBuf );

			view[0] = data;

			return view;
		},

		is: function ( tk, head, right, left ) {
			let result = false;

			if ( head ) {
				if ( tk.head === head )
					result = true;
				else
					result = false;
			}
			if ( right ) {
				if ( tk.right === right )
					result = true;
				else
					result = false;
			}
			if ( left ) {
				if ( tk.left === left )
					result = true;
				else
					result = false;
			}

			return result;
		},

		getTypeCode: function ( type ) {
			if ( type === 'string' )
				return 20;
			if ( type === 'char' )
				return 21;
			if ( type === 'int' )
				return 22;
			if ( type === 'float' )
				return 23;
			if ( type === 'bool' )
				return 24;
			if ( type === 'null' )
				return 25;
		},
	};
	// Util

	// Handel
	const handel = {
		EOF: function () {
			const byte = util.byte( 0 );
			util.programBuffer.push( byte );
		},

		print: function () {
			const token = util.token;
			const bytes = [ util.byte( 1 ) ];

			const typeCode = util.byte( util.getTypeCode( token.right.head ) );
			bytes.push( typeCode );

			if ( typeCode.at( 0 ) === 20 ) {
				for ( let i = 0; i < token.right.right.length; i++ ) {
					const byte = util.byte(
						token.right.right.charCodeAt( i )
					);

					bytes.push( byte );
				}

				const eos = util.byte( 0 );
				bytes.push( eos );
			}else if ( typeCode.at( 0 ) === 21 ) {
				const byte = util.byte( util.token.right.right.charCodeAt( 0 ) );
				bytes.push( byte );
			}else if ( typeCode.at( 0 ) === 22 || typeCode.at( 0 ) === 23 ) {
				const byte = util.byte( Number( util.token.right.right ) );
				bytes.push( byte );
			}else if ( typeCode.at( 0 ) === 24 ) {
				const value = util.token.right.right;
				const byteVal = ( value === 'false' ) ? 0 : 1;
				const byte = util.byte( byteVal );
				bytes.push( byte );
			}

			for ( let i = 0; i < bytes.length; i++ ) {
				util.programBuffer.push( bytes[ i ] );
			}

			util.position++;
		},
	};
	// Handel

	// Init
	util.clean();
	// Init

	__process__ : while ( util.status ) {
		if ( util.is( util.token, 'EOF', 'EOF' ) ) {
			handel.EOF();
			break;
		}else if ( util.is( util.token, 'print' ) ) {
			handel.print();
			continue;
		}

		util.position++;
	}

	// write byte codes
	for ( let i = 0; i < util.programBuffer.length; i++ ) {
		util.write( util.programBuffer[ i ] );
	}
	// write byte codes
}

module.exports = compiler;