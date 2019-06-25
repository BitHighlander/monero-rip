let rpc = require("./modules/rpc")
let log = require("default-logger")
let TAG = " | APP | "

module.exports = {
	historyToCSV: function () {
		return history_to_csv();
	},
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


		return result
	}catch(e){
		throw e
	}
}