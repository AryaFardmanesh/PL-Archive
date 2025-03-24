// Import libraries
const gulp = require( 'gulp' );
const clean = require( 'gulp-clean' );
const webpack = require( 'webpack-stream' );
const babel = require( 'gulp-babel' );
const terser = require( 'gulp-terser' );

const config = require( './build.json' );


/**
 * @gulp
 * @name clean-out
 * @description This task used for removing '/dist' directory.
**/
gulp.task( 'clean', () => {
	return (
		gulp.src( config.output, { allowEmpty: true } )
			.pipe( clean() )
	);
} );


/**
 * @gulp
 * @name build
 * @author Arya Fardmanesh
 * @description This task used for building program to output.
**/
gulp.task( 'build', () => {
	return (
		gulp.src( config.entry )
			.pipe( webpack( config.webpack ) )
			.pipe( babel( config.babel ) )
			.pipe( terser( config.terser ) )
			.pipe( gulp.dest( config.output ) )
	);
} );


/**
 * @gulp
 * @name default
 * @author Arya Fardmanesh
 * @description This task build the project.
**/
module.exports.default = gulp.series(
	gulp.task( 'clean' ),
	gulp.task( 'build' )
);
