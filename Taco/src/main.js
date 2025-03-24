import path from 'node:path';
import fs from 'node:fs';

import Lexer from "./lexer/lexer";
import Parser from "./parser/parser";
import CodeGen from './codegen/codegen';
import Runtime from './runtime/runtime';

let logs = '';
let exitCode = 0;

async function execute( layer, data, name ) {
	logs += `${ name } start task.\n`;

	try {
		const result = await ( new layer( data ) ).result;

		if ( result?.error === undefined ) {
			result.logs += `${ name } refused to generate data.\n`;
			exitCode = 1;
			return false;
		}

		if ( result.error ) {
			logs += `${ name } failed to process.\n`;
			logs += `Error received: ${ result.error }\n`;

			logs += `${ name } generated incomplete data.\n`;
			logs += `${ JSON.stringify( result.program ) }\n`;

			console.error( result.error );
			exitCode = 1;
			return false;
		}

		logs += `${ name } generated following data.\n`;
		logs += `${ JSON.stringify( result.program ) }\n`;
		logs += `${ name } finished task.\n`;

		return result;
	}catch ( err ) {
		logs += `Fatal Error: ${ name } crashed.\n`;
		logs += `Error received: ${ err }\n`;
		logs += `${ name } finished task.\n`;
		exitCode = 1;
		return false;
	}
}

async function executeProgram( address, code ) {
	let data = {
		path: address,
		program: code,
		error: null
	};

	logs += `Received path: "${ address }"\n`;
	logs += 'Start executing program.\n';

	data = await execute( Lexer, data, 'Lexer' );
	if ( !data ) {
		logs += 'Finish executing program.\n';
		logs += `Exit code: ${ exitCode }\n`;
		return;
	}

	data = await execute( Parser, data, 'Parser' );
	if ( !data ) {
		logs += 'Finish executing program.\n';
		logs += `Exit code: ${ exitCode }\n`;
		return;
	}

	data = await execute( CodeGen, data, 'CodeGen' );
	if ( !data ) {
		logs += 'Finish executing program.\n';
		logs += `Exit code: ${ exitCode }\n`;
		return;
	}

	// ========== Runtime Env ==========
	logs += `Runtime start program.\n`;
	const runtime = new Runtime( data );
	try {
		await runtime.execute();
		const result = runtime.result;

		if ( result.error ) {
			logs += `Runtime failed to execute program.\n`;
			logs += `Error received: ${ result.error }\n`;

			console.error( result.error );
			exitCode = result.exit;
			return false;
		}
	}catch ( err ) {
		logs += `Fatal Error: Runtime crashed.\n`;
		logs += `Error received: ${ err }\n`;
		logs += `Runtime finished task.\n`;
		exitCode = 1;
		logs += 'Finish executing program.\n';
		logs += `Exit code: ${ exitCode }\n`;
		return false;
	}
	logs += `Runtime finish program.\n`;
	// ========== Runtime Env ==========

	logs += 'Finish executing program.\n';
	logs += `Exit code: ${ exitCode }\n`;
}

function version() {
	console.log( 'The Taco version is #DEFINE{VERSION} compiled in #DEFINE{DATE}' );
	console.log( 'Developer Taco is #DEFINE{AUTHORINFO}' );
	process.exit( 0 );
}

void (async function () {

	const argv = process.argv;
	argv.shift();
	argv.shift();

	if ( argv.length === 0 ) {
		console.error( 'Taco: Fatal error: No input files.' );
		process.exit( 1 );
	}


	let showLogs = false;

	for ( const item of argv ) {
		if ( item === '--version' || item === '-v' ) {
			version();
		}else if ( item === '--show-log' ) {
			showLogs = true;
		}
	}


	const targetFileArgv = ( argv[ 0 ].endsWith( 'taco' ) ) ? argv[ 0 ] : argv[ 0 ] + '.taco';
	const targetFilePath = path.join( process.cwd(), targetFileArgv );

	if ( !( await fs.existsSync( targetFilePath ) ) ) {
		console.error( 'Taco: Fatal error: The specified address is not exist.' );
		process.exit( 1 );
	}


	const targetFileContent = await fs.readFileSync( targetFilePath, 'utf-8' );
	await executeProgram( targetFilePath, targetFileContent );

	if ( showLogs ) {
		const targetFilePathParsed = path.parse( targetFilePath );
		const targetFileLog = path.join( targetFilePathParsed.dir, targetFilePathParsed.name + '.log' );
		await fs.writeFileSync( targetFileLog, logs );
	}

	process.exit( exitCode );

}) ();
