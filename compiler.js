const { Attribute } = require("./ast");

module.exports.Compiler = class {
	constructor(tags){
		this.keys = Object.keys(tags);
		this.tags = tags;
	};
	tag(tag){
		let name = this.keys.indexOf(tag.name.str);
		name = name == -1 ? Buffer.alloc(1).fill(tag.name.str.charCodeAt(0)|0x80).toString() + tag.name.str.substr(1, tag.name.str.length-1) : String.fromCharCode(name);
		const body = this.body(tag.content);

		return `<${name}${this.attributes(tag.name.str, tag.attributes)}${tag.content ? `${body[0] == '<' || body[0] == '>' ? body : `|${body}`}`: "" }>`
	};
	attributes(tag, attributes){
		let text = "";
		let attributes_ = this.tags[tag] || {};
		
		for(let { name, value } of attributes){
			let x = attributes_[name.str];
			text += x ? String.fromCharCode(x) : Buffer.alloc(1).fill(name.str.charCodeAt(0)|0x80).toString() + name.str.substr(1, name.str.length-2) + Buffer.alloc(1).fill(name.str.charCodeAt(name.str.length-1)|0x80).toString();
			text += value.str;
			text += '"';
		}
		return text;
	};
	body(body){
		return body.map((c) => {
			if(!c.name){
				return c.text.trim();
			} else {
				return this.tag(c);
			}
		}).join("");
	};
};