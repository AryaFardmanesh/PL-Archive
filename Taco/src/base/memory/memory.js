import LinkedList from '../ds/linkedlist';
import MemoryStruct from './memory.struct';

const __mem_base__ = Symbol( "The memory base private property." );

class Memory {
	constructor() {
		this[ __mem_base__ ] = new LinkedList();
	}

	malloc( name, type, buff ) {
		this[ __mem_base__ ].push(
			new MemoryStruct( name, type, buff, buff.size )
		);
	}

	fetch( name ) {
		let current = this[ __mem_base__ ].head;
		while ( current !== null ) {
			if ( current.data.name === name ) {
				return current.data;
			}

			current = current.next;
		}

		return null;
	}
}

export default Memory;
