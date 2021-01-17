const { Node, TextNode, Attribute } = require("./ast");
const { TokenTypes, Token } = require("./tokens");
const util = require("util");

module.exports.Parser = class {
	constructor(lexer){
		this.lexer = lexer;
		this.current = lexer.nextToken();
	};
	peek(){
		return this.current;
	};
	eat(){
		this.current = this.lexer.done() || this.lexer.nextToken();
		return this.current;
	};
	assert(condition, error){
		if(condition){
			return;
		} else {
			console.error(new Error(error || `Error (position ${this.lexer.position}, ${JSON.stringify(this.peek())})`));
			process.exit(1);
		}
	};
	parseTag(){
		this.assert(this.peek().type == TokenTypes.TAG_DELIMITER_L);
		const tag = this.eat();
		this.assert(tag.type == TokenTypes.WORD);
		this.eat();

		const attributes = this.parseAttributes();
		
		let content;
		if(this.peek().type == TokenTypes.SLASH){
			this.eat();
			content = [];
		} else {
			content = this.parseTagBody();
		}
		this.eat();
		return new Node(tag, attributes, content);
	};
	parseAttributes(){
		const attrubutes = [];

		for(let token = this.peek(); token.type != TokenTypes.TAG_DELIMITER_R && token.type != TokenTypes.SLASH; token = this.eat()){
			this.assert(token.type == TokenTypes.WORD);
			this.assert(this.eat().type == TokenTypes.EQUAL);
			
			const value = this.eat();
			this.assert(value.type = TokenTypes.STRING);

			attrubutes.push(new Attribute(token, value));
		}
		return attrubutes;
	};
	parseTagBody(){
		const body = [];

		for(let token = this.peek();; token = this.eat()){
			switch(token.type){
			case TokenTypes.TAG_DELIMITER_L:
				const tag = this.parseTag2();
				
				if(tag) body.push(tag);
				else return body;
			default:
				body.push(this.parseTextNode());
			}
		}
	};
	parseTag2(){
		const tok = this.eat();

		if(tok.type == TokenTypes.SLASH){
			this.eat();
			this.assert(this.eat().type == TokenTypes.TAG_DELIMITER_R);
			return null;
		}
		this.eat();

		const attributes = this.parseAttributes();
		let content;

		if(this.peek().type == TokenTypes.SLASH){
			this.eat();
			content = [];
		} else if(tok.str == "script" || tok.str == "style"){
			content = [this.parseTextNode()];
		} else {
			content = this.parseTagBody();
		}
		return new Node(tok, attributes, content);
	}
	parseTextNode(){
		const t = new TextNode(this.lexer.skipTag());
		return t;
	};
};

module.exports.BinaryParser = class {
	constructor(tags, data){
		this.tags = tags;
		this.keys = Object.keys(tags);
		this.data = data;
		this.position = 0;
	};
	peek(){
		return this.data[this.position];
	};
	eat(){
		return this.data[++this.position];
	};
	assert(condition, error){
		if(condition){
			return;
		} else {
			console.error(new Error(error || `Error (position ${this.lexer.position}, ${JSON.stringify(this.peek())})`));
			process.exit(1);
		}
	};
	parseTag(){
		this.assert(this.eat() == '<');
		
		let tag;
		const i = this.peek().charCodeAt(0);

		if( (i & 0x80) == 0x80){
			tag = this.word();
		} else {
			tag = this.keys[i];
		}
		const attributes = this.parseAttributes(this.tags[tag]);
	};
	parseAttributes(attributes_){
		let attributes = [];
		
	};
};