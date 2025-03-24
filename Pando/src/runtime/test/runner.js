const path = require('path');

const preprocessor = require("../../preprocessor/preprocessor");
const scanner = require("../../scanner/scanner");
const parser = require("../../parser/parser");
const compiler = require("../../compile/compiler");

const code =
`
print "Hello world!";
print "Hello world!";
print '\n';
print true;
print '\n';
print false;
print '\n';
print null;
print '\n';
print 124;
print '\n';
print 1.24;
print '\n';
print +1.51;
print '\n';
print -1.51;
print '\n';
print +151;
print '\n';
print -151;
print '\n';
`;

const data = preprocessor( code ).source;
const tokens = scanner( data ).tokens;
const ast = parser( tokens ).tokens;

compiler( ast, ( path.join( __dirname, 'test.bp' ) ) );