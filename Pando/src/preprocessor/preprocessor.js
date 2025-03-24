function preprocessor( source ) {
	if ( typeof source != "string" ) {
		throw new TypeError(`The preprocessor engine only takes the string type from the input.`);
	}

	// import modules
	const resultFunc = require( './../var/result' );
	const utilFunc = require( './../var/util' );
	// import modules

	// init
	const result = resultFunc();
	const util = utilFunc();

	util.source = source;
	util.result = result;
	// init

	// Main
	__proccess__ : while ( util.status ) {
		if ( util.char === '\0' ) {
			break;
		}else if ( util.char === '$' ) {
			util.skipSingleComment();
			continue;
		}else if ( util.char === '/' && util.peek( 1 ) === '*' ) {
			util.skipMultiLineComment();
			continue; 
		}else if ( util.char === '\n' ) {
			util.line++;
			util.appendCharToSource();
			util.position++;
			continue;
		}else if ( util.char === '"' ) {
			const str = util.getStringTrack();
			util.appendCharToSource( `"${ str }"` );
			continue;
		}else if ( util.char === '\'' ) {
			const str = util.getCharTrack();
			util.appendCharToSource( `'${ str }'` );
			continue;
		}

		util.appendCharToSource();
		util.position++;
	}
	// Main

	return result;
}

module.exports = preprocessor ;