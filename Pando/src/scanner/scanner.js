function scanner( source ) {
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
			util.appendToken( 'EOF', 'EOF' );
			break;
		}else if ( util.char === '\n' ) {
			util.line++;
			util.position++;
			continue;
		}else if ( util.char === ' ' ) {
			util.position++;
			continue;
		}else if ( util.char === ';' ) {
			util.appendToken( 'semicolon', util.char );
			util.position++;
			continue;
		}else if ( util.char === '"' ) {
			const str = util.getStringTrack();
			util.appendToken( 'string', str );
			continue;
		}else if ( util.char === '\'' ) {
			const ch = util.getCharTrack();
			util.appendToken( 'char', ch );
			continue;
		}else if ( util.isNumberTrack() ) {
			const numberObject = util.getNumber();
			util.appendToken( numberObject.type, numberObject.value );
			continue;
		}

		// Keyword tokens
		let getToken = '';

		while ( true ) {
			if ( util.isSeparator( util.char ) ) {
				break;
			}

			getToken += util.char;
			util.position++;
		}

		util.handelGotKey( getToken );
		continue;
		// Keyword tokens
	}
	// Main

	return result;
}

module.exports = scanner ;