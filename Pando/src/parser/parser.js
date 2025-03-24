function parser( tokens ) {
	// import modules
	const resultFunc = require( './../var/result' );
	const utilFunc = require( './../var/util' );
	// import modules

	// init
	const result = resultFunc();
	const util = utilFunc();

	util.tokens = tokens;
	util.result = result;
	// init

	// Main
	__proccess__ : while ( util.status ) {
		if ( util.isEOFToken( util.currentToken ) ) {
			util.appendNode( util.currentToken.id, util.currentToken.id );
			break;
		}else if ( util.currentToken.id === 'keyword' && util.currentToken.value === 'print' ) {
			util.handelPrintSt();
			continue;
		}

		util.position++;
	}
	// Main

	return result;
}

module.exports = parser ;