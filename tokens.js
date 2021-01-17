module.exports.TokenTypes = {
	TAG_DELIMITER_L  : 0,
	TAG_DELIMITER_R  : 1,
	EQUAL            : 2,
	STRING           : 3,
	SPACE            : 4,
	WORD             : 5,
	PARA             : 6,
	SLASH            : 7,
	EXL              : 8,
	OTHER            : 9
};

module.exports.Token = class {
	constructor(type, str){
		this.type = type;
		this.str = str;
	};
};