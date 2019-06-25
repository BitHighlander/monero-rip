let rpc = require("./modules/rpc")

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
		let result = await rpc.get("sending","show_transfers")
		log.info(tag,"result: ",result)


		return result
	}catch(e){
		throw e
	}
}