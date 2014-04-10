var request = require("request");
 
request({
	uri: "http://localhost:3000/updatesession?u=1",
	method: "GET",
	form: {
		eid:"1",
		tid:"2",
		aid:"3",
		pos:{x:20, y:20},
		level:"level2"
	}}, function(error, response, body) {
  		console.log(body);
});
