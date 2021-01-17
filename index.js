const { Lexer } = require("./lexer");
const { Parser } = require("./parser");
const { Compiler } = require("./compiler");
const tags = require("./tags.json");

const fs = require("fs");
const util = require("util");

const t1 = Date.now();

const lexer = new Lexer(`
<html lang="en" dir="ltr">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    	<title>Sidekick</title>
    	<link rel="icon" id="favicon" type="image/png" href="chrome-extension://mcjlamohcooanphmebaiigheeeoplihb/assets/icons/64x64.png"/>
	</head>
	<body style="background-color: var(--bg-color);">
		<iframe id="launchpad" src="./Sidekick_files/saved_resource.html"></iframe>
		<div>jkansdjsa</div>
	</body>
</html>
`);

const parser = new Parser(lexer);
const doc = parser.parseTag();

const compiler = new Compiler(tags);
const bhtml = compiler.tag(doc);

const t2 = Date.now();

console.log(util.inspect(doc, { depth: Infinity, colors: true }));
console.log(bhtml, lexer.data.length, bhtml.length, lexer.data.length - bhtml.length);
console.log(`Time Taken: ${t2-t1}ms.`);

fs.writeFileSync("test.bhtml", bhtml);
