const __base__ = Symbol( 'The base of buffer' );

class MemoryBuffer {
	constructor( data, size ) {
		this[ __base__ ] = Buffer.alloc( size, data, 'binary' );
		this.size = size;
	}

	realloc( data, size ) {
		this[ __base__ ] = Buffer.alloc( size, data, 'binary' );
		this.size = size;
	}

	write( data ) {
		this[ __base__ ].write( data );
	}

	read() {
		let arr = [];

		for ( let i = 0; i < this.size; i++ ) {
			const byte = this[ __base__ ].at( i );
			arr.push( byte );
		}

		return arr;
	}
}

export default MemoryBuffer;
