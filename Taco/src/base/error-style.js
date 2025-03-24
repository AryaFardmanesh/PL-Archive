function createErrorStyle( path = '', line = 1, message = '' ) {
	return (
		`TACO ERROR:\n` +
		`\tPath: "${ path }:${ line }"\n` +
		`\tMessage: "${ message }"`
	);
}

export default createErrorStyle;
