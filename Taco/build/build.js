const path = require( 'path' );
const fs = require( 'fs' );
const execSync = require( 'child_process' ).execSync;

const pkg = require( './../package.json' );
const config = require( './../build.json' );

function getTime() {
	const date = new Date();
	let str = '';

	str += ( date.getFullYear() + '/' );

	let month = date.getMonth().toString();
	if ( month.length === 1 ) {
		month = '0' + month;
	}
	str += ( month + '/' );

	let day = date.getDay().toString();
	if ( day.length === 1 ) {
		day = '0' + day;
	}
	str += day;

	return str;
}

const defineMapper = {
	version: pkg.version,
	date: getTime(),
	authorInfo: `${ pkg.author.name } <${ pkg.author.url }>`
};

void (async function () {

	// Build project
	await execSync( 'gulp' );

	// Read dist
	const outputFilePath = path.join( process.cwd(), config.output, 'main.js' );
	let outputFileContent = await fs.readFileSync( outputFilePath, { encoding: 'utf-8', flag: 'r' } );

	// Change data
	for ( const defkey in defineMapper ) {
		const key = `#DEFINE{${ defkey.toUpperCase() }}`;

		outputFileContent = outputFileContent.replaceAll( key, defineMapper[ defkey ] );
	}

	// Save dist
	await fs.writeFileSync( outputFilePath, outputFileContent, 'utf-8' );

	// Exit
	process.exit( 0 );

}) ();
