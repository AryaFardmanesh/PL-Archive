class LinkedList {
	Node = class {
		constructor( data, next = null ) {
			this.data = data;
			this.next = next;
		}
	}

	constructor() {
		this.head = null;
		this.tail = null;
	}

	isEmpty() {
		return ( this.head === null );
	}

	push( data ) {
		const node = new this.Node( data );

		if ( this.isEmpty() ) {
			this.head = node;
			this.tail = this.head;
			return;
		}

		this.tail.next = node;
		this.tail = this.tail.next;
	}

	shift() {
		if ( this.isEmpty() ) {
			return;
		}

		const _head = this.head.next;
		const current = this.head;

		this.head.next = null;
		this.head = _head;

		return current.data;
	}

	pop() {
		if ( this.isEmpty() ) {
			return;
		}

		let current = this.head;

		while ( current.next.next !== null ) {
			current = current.next;
		}

		const last = this.tail;
		current.next = null;

		return last.data;
	}

	toArray() {
		let arr = [];

		let current = this.head;
		while ( current !== null ) {
			arr.push( current.data );
			current = current.next;
		}

		return arr;
	}
}

export default LinkedList;
