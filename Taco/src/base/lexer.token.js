class Token {
	constructor( kind, value, raw, start, line ) {
		this.kind = kind;
		this.value = value;
		this.raw = raw;
		this.start = start;
		this.end = start + raw.length;
		this.size = raw.length;
		this.line = line;
	}
}

export default Token;
