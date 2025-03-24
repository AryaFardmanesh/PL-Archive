function convertEscapeSequenceChar( ch ) {
	if ( typeof ch !== 'string' ) {
		return false;
	}

	switch ( ch ) {
	case '0':
		return '\0';
	case '"':
		return '\"';
	case '\'':
		return '\'';
	case '\\':
		return '\\';
	case 'n':
		return '\n';
	case '\r':
		return 'r';
	case 't':
		return '\t';
	default:
		return ch;
	}
}

export default convertEscapeSequenceChar;
