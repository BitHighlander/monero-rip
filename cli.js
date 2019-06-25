/*
	Get all tx history

	Save to csv


 */


let app = require("./app.js")
let describe = require('describe-export')
const vorpal = require('vorpal')();
const log = require('default-logger')()


//globals
let prompt = "client: "


let TAG = " | CLI | "






//map module
const map = describe.map(app)
console.log("methods known: ",map)




let help = {
	getCoinbase:""
}





Object.keys(map).forEach(function(key) {
	let tag = TAG + " | "+key+" | "
	let debug = false
	log.debug(tag,"key: ",key)
	let expectedParams = map[key]

	log.debug(tag,"expectedParams: ",expectedParams)

	let helpString
	if(help[key]) helpString = help[key]
	if(!helpString) helpString = key+": expected params: "+expectedParams

	vorpal.command(key, helpString)
		.action(function (args, cb) {
			let self = this;
			let params = []

			if(expectedParams.length > 0){
				for(let i = 0; i < expectedParams.length; i++){
					let param = {
						type: 'input',
						name: expectedParams[i],
						message: "input "+expectedParams[i]+": "
					}
					params.push(param)
				}
			}



			let promise = this.prompt(params, function (answers) {
				// You can use callbacks...

			});

			promise.then(async function(answers) {
				log.debug(tag,"answers: ",answers)

				let parameters = []
				Object.keys(answers).forEach(function(answer) {
					parameters.push(answers[answer])
				})
				console.log(tag,"parameters: ",parameters)
				try{
					const result = await app[key].apply(this, parameters)
					console.log("result: ",result)
				}catch(e){
					console.error(tag,"e: ",e)
				}
				cb();
			});
		});

	console.log(prompt)
})


console.log(" Monero toolkit")

vorpal
	.delimiter(prompt)
	//.action(app.tick())
	.show();
