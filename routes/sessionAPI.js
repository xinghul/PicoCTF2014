exports.GetSession = function(db) {
	return function(req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		var aid = req.query.aid;
		if (!aid)
			res.send({success : 0, msg : "Please specify the aid for the session."});
		else {
			db.findOne({aid : aid}, function (err, session) {
				console.log(req.ip + ' : GetSession : ' + aid);
				if (!err)
				{
					console.log('Success.');
					res.send(session);
				}
				else 
				{
					console.log('Fail.');
					res.send({success : 0, msg : "These's an error while retrieving the session info."});
				}
			});
		}
	};
};

exports.UpdateSession = function(db) {
	return function(req, res) {
		var aid = req.query.aid;
		var data = req.body;
		console.log(req.ip + ' : UpdateSession : ' + aid);
		if ([undefined, null].indexOf(data.eid) != -1 ||
			[undefined, null].indexOf(data.tid) != -1 ||
			[undefined, null].indexOf(data.pos) != -1 ||
			[undefined, null].indexOf(data.level) != -1) {
			console.log('Fail : Invalid arguments.');
			res.send({success : 0, msg : "Invalid arguments."});
			return;
		}

		db.findOne({aid : aid}, function (err, session) {
			if (err | session != null) {
				console.log('Success : Update.');
				session.eid = data.eid;
				session.pos = data.pos;
				session.level = data.level;
				session.save();
				res.send({success : 1, msg : "Update session successfully."});
				return;
			}
			db.create({
				"aid" : aid,
				"eid" : data.eid,
				"tid" : data.tid,
				"pos" : data.pos,
				"level" : data.level
			}, function(err, doc) {
				if (err) {
					console.log(err);
					res.send({success : 0, msg : "Error occurs when updating the session."});
				} else {
					console.log('Success : Add.');
					res.send({success : 1, msg : "Add session successfully."});
				}
			});
		});
	};
};