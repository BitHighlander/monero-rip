let rpc = require("./modules/rpc")
let log = require("default-logger")
let TAG = " | APP | "
const json2csv = require('json2csv').Parser;

module.exports = {
	historyToCSV: function () {
		return history_to_csv();
	},
}


let raw_to_csv = async function (data, title) {
	let tag = TAG+" | raw_to_csv | "
	try {
		// let fields = Object.keys(data[0])
		let fields = []

		// iterate over entire dataset
		// get all keys
		for (let i = 0; i < data.length; i++) {
			let entryFields = Object.keys(data[i])
			for (let j = 0; j < entryFields.length; j++) {
				fields.push(entryFields[j])
			}
		}

		fields = fields.filter(function (elem, pos) {
			return fields.indexOf(elem) == pos
		})

		//const result = new json2csv({ data: data, fields: fields })
		const json2csvParser = new json2csv({fields})
		const result = json2csvParser.parse(data);
		console.log(tag,"result: ",result)


		const filename = '../reports/'+title + '.csv'
		await write_file(filename, result)



		// upload to slack
		//await upload_to_slack(filename, config.SLACK_CHANNEL_NAME)
		//await upload_to_slack(filename, config.SLACK_CHANNEL_NAME_REPORTS)

		return { success: true }
	} catch (e) {
		console.error(tag,e)
		throw e
	}
}


const write_file = function (filename, data) {
	const d = when.defer()

	fs.writeFile(filename, data, function (err) {
		if (err) throw err

		d.resolve(true)
	})
	return d.promise
}
let history_to_csv = async function(){
	let tag = TAG + " | history_to_csv | "
	try{

		//
		let min = 0
		let max = 1864855
		let params = {filter_by_height:true,min_height:min,max_height:max,in:true,out:true,pool:true}

		let result = await rpc.get("sending","get_transfers",params)
		console.log(tag,"result: ",result)

		let csv = await raw_to_csv(result)

		//write to file
		let writeSuccess = await write_file("reportTXS.csv",csv)
		console.log(writeSuccess)

		return true
	}catch(e){
		throw e
	}
}