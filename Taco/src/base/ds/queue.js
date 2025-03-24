const __base__ = Symbol( 'The base array of queue' );
const __front__ = Symbol( 'The front of queue' );
const __rear__ = Symbol( 'The rear of queue' );

class Queue {
	constructor() {
		this[ __base__ ] = [];
		this[ __front__ ] = 0;
		this[ __rear__ ] = 0;
	}

	isEmpty() {
		return ( this[ __front__ ] === this[ __rear__ ] );
	}

	enqueue( data ) {
		this[ __base__ ][ this[ __front__ ]++ ] = data;
	}

	dequeue() {
		if ( this.isEmpty() ) {
			return;
		}

		return this[ __base__ ][ this[ __rear__ ]++ ];
	}

	toArray() {
		return this[ __base__ ].slice( this[ __rear__ ], this[ __front__ ] );
	}
}

export default Queue;
