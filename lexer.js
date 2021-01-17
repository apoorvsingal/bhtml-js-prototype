const { TokenTypes, Token } = require("./tokens");

module.exports.Lexer = class {
	constructor(data){
		this.position = 0;
		this.data = data;
	};
	peek(){
		return this.data[this.position];
	};
	eat(){
		return this.data[++this.position];
	};
	done(){
		return this.data.length-1 == this.position;
	};
	assert(condition, error){
		if(condition){
			return;
		} else {
			console.error(new Error(error));
			process.exit(1);
		}
	};
	isSpace(char){
		return char == ' ' || char == '\t' || char == '\n';
	};
	isWordBegining(char){
		const code = char.charCodeAt(0);
		return (code >= 'a'.charCodeAt(0) && code <= 'z'.charCodeAt(0)) || (code >= 'A'.charCodeAt(0) && code <= 'Z'.charCodeAt(0)) || char == '_' || char =='-';
	};
	isWordPart(char){
		const code = char.charCodeAt(0);
		return this.isWordBegining(char) || (code >= '0'.charCodeAt(0) && code <= '9'.charCodeAt(0));
	};
	skipSpaces(){
		for(let char = this.peek(); this.isSpace(char); char = this.eat()){}
	};
	skipTag(){
		let str = "";
		for(let char = this.peek(); char != '<'; char = this.eat()){
			str += char;
		}
		return str;
	};
	nextToken(){
		this.skipSpaces();
		const char = this.peek();
		
		switch(char){
		case '<':
			this.eat()
			return new Token(TokenTypes.TAG_DELIMITER_L, '<');
		case '>':
			this.eat();
			return new Token(TokenTypes.TAG_DELIMITER_R, '>');
		case '/':
			this.eat();
			return new Token(TokenTypes.SLASH, '/');
		case '=':
			this.eat();
			return new Token(TokenTypes.EQUAL, '=');
		case '!':
			this.eat();
			return new Token(TokenTypes.EXL, '!');
		case '"':
			return this.string();
		}
		if(this.isWordBegining(char)){
			return this.word();
		} else {
			this.eat();
			return new Token(TokenTypes.OTHER, char);
		}
	};
	string(){
		let str = this.eat();
		for(let c = this.eat(); c != '"'; c = this.eat()){
			str += c;
		}
		this.eat();
		return new Token(TokenTypes.STRING, str);
	};
	word(){
		let word = this.peek();
		for(let c = this.eat(); this.isWordPart(c); c = this.eat()){
			word += c;
		}
		return new Token(TokenTypes.WORD, word);
	};
};