var request = require("request");
 
request({
	uri: "http://localhost:3000/problemdisplayed",
	method: "POST",
	form: {
		pid: 3,
		tid: 1,
		username: "user1"
	}}, function(error, response, body) {
  		console.log(body);
});
