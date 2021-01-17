module.exports.Node = class {
	constructor(name, attributes, content){
		this.name = name;
		this.attributes = attributes;
		this.content = content;
	}
};

module.exports.TextNode = class {
	constructor(text){
		this.text = text;
	}
};

module.exports.Attribute = class {
	constructor(name, value){
		this.name = name;
		this.value = value;
	}
};