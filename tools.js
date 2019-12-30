let rpc = require("./modules/rpc")
let log = require("default-logger")
let TAG = " | APP | "
const json2csv = require('json2csv').Parser;
const when = require('when');
const fs = require("fs")
const SlackUpload = require('node-slack-upload')
const slackUp = new SlackUpload(process.env['SLACK_TOKEN'])

module.exports = {
	historyToCSV: function () {
		return history_to_csv();
	},
	getBalance: function () {
		return get_balance();
	},
}


let raw_to_csv = async function (data) {
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

		console.log("fields: ",fields)

		//const result = new json2csv({ data: data, fields: fields })
		const json2csvParser = new json2csv({fields})
		const result = json2csvParser.parse(data);
		console.log(tag,"result: ",result)


		//const filename = '../reports/'+title + '.csv'
		//await write_file(filename, result)



		// upload to slack
		//await upload_to_slack(filename, config.SLACK_CHANNEL_NAME)
		//await upload_to_slack(filename, config.SLACK_CHANNEL_NAME_REPORTS)

		return result
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


let normalize_data = function(rawData){
	try{
		let output = []
		//iterate over in's
		for(let i = 0; i < rawData.in.length; i++){
			let entry = rawData.in[i]
			entry.type = "credit"
			output.push(entry)
		}
		//iterate over out's
		for(let i = 0; i < rawData.out.length; i++){
			let entry = rawData.out[i]
			entry.type = "debit"
			output.push(entry)
		}
		return output
	}catch(e){
		throw e
	}
}

/*

curl -X POST http://127.0.0.1:8083/json_rpc -d '{"jsonrpc":"2.0","id":"0","method":"get_balance","params":{"account_index":0,"address_indices":[0,1]}}' -H 'Content-Type: application/json'


 */
let get_balance = async function(){
	try{
		let params = {"account_index":0,"address_indices":[0,1]}

		let result = await rpc.get("sending","get_balance",params)

		//upload to slack



	}catch(e){
		throw e
	}
}

let history_to_csv = async function(wallet,start,stop){
	let tag = TAG + " | history_to_csv | "
	try{

		//
		let min = start || 0
		let max = stop  || 1864855
		let params = {filter_by_height:true,min_height:min,max_height:max,in:true,out:true,pool:true}

		let result = await rpc.get("sending","get_transfers",params)
		console.log(tag,"result: in: ",result.in.length)
		console.log(tag,"result: out: ",result.out.length)

		let data = normalize_data(result)

		let csv = await raw_to_csv(data)
		console.log("final length: ",csv.length)
		//write to file
		let filename = "XMR:TXS:report:"+new Date()
		let writeSuccess = await write_file(filename,csv)
		console.log(writeSuccess)

		// upload to slack
		//await upload_to_slack(filename, config.SLACK_CHANNEL_NAME)
		await upload_to_slack(filename, "year_end_snapshot")

		return true
	}catch(e){
		throw e
	}
}

const upload_to_slack = function (filename, channel) {
	const d = when.defer()
	let tag = ' | upload_to_slack | '

	slackUp.uploadFile({
		file: fs.createReadStream(filename),
		filetype: 'csv',
		title: filename,
		initialComment: filename,
		channels: channel
	}, function (err, data) {
		if (err) {
			console.error(tag, err)
			d.resolve(false)
		} else {
			console.log('Uploaded file details: ', data)
			d.resolve(true)
		}
	})

	return d.promise
}