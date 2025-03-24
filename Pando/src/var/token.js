module.exports = class Token {
	constructor( id, value, line = 1 ) {
		this.id = id;
		this.value = value;
		this.line = line;
	}
}