/*
	JSON-RPC

 */
let TAG = " | RPC | "

const when = require('when');
const http = require('http');

module.exports = {
	get: function (wallet,method,params) {
		return make_request(wallet,method,params);
	},
}


function jsonHttpRequest(host, port, data, callback) {

	var options, req;

	options = {
		hostname: host,
		port: port,
		path: '/json_rpc',
		method: 'POST',
		headers: {
			'Content-Length': data.length,
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	};

	req = http.request(options, function (res) {
		var replyData = '';
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			replyData += chunk;
		});
		res.on('end', function () {
			var replyJson;
			try {
				replyJson = JSON.parse(replyData);
			} catch (e) {
				callback(e);
				return;
			}
			callback(null, replyJson);
		});
	});

	req.on('error', function (e) {
		callback(e);
	});

	req.end(data);
}




function rpc(host, port, method, params, callback) {

	var data = JSON.stringify({
		id: "0",
		jsonrpc: "2.0",
		method: method,
		params: params
	});
	console.log("data:",data )
	jsonHttpRequest(host, port, data, function (error, replyJson) {
		if (error) {
			callback(error);
			return;
		}
		callback(replyJson.error, replyJson.result);
	});
}


var make_request = function (wallet,method,params)
{
	var d = when.defer();
	var tag = TAG+" | yubikey | "
	var output
	var debug = false

	var ip = "127.0.0.1"
	var port
	if(wallet == "receiving") port = 8082
	if(wallet == "sending")   port = 8083
	rpc(ip, port, method, params, function (error, result) {
		if (error) {
			console.error("error ", error);
			d.resolve(error)
		} else {
			//console.log(result)
			d.resolve(result)
		}
	});

	return d.promise
}

