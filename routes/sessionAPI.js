exports.GetSession = function(Session) {
	return function(req, res) {
		var username = req.query.u;
		console.log(req.ip + ' : GetSession : ' + username);
		if (!username)
			res.send({success : 0, msg : "Please specify the username for the session."});
		else {
			Session.findOne({username : username}, function (err, session) {
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

exports.UpdateSession = function(Session) {
	return function(req, res) {
		var username = req.body.username;
		var data = req.body;
		console.log(req.ip + ' : UpdateSession : ' + username);
		console.log(req.body);
		if ([undefined, null].indexOf(data.aid) != -1 ||
			[undefined, null].indexOf(data.eid) != -1 ||
			[undefined, null].indexOf(data.tid) != -1 ||
			[undefined, null].indexOf(data.pos) != -1 ||
			[undefined, null].indexOf(data.level) != -1) {
			console.log('Fail : Invalid arguments.');
			res.send({success : 0, msg : "Invalid arguments."});
			return;
		}

		Session.findOne({username : username}, function (err, session) {
			if (err | session != null) {
				console.log('Success : Update.');
				session.aid = data.aid;
				session.eid = data.eid;
				session.pos = data.pos;
				session.tid = data.tid;
				session.level = data.level;
				session.save();
				res.send({success : 1, msg : "Update session successfully."});
				return;
			}
			Session.create({
				"username" : username,
				"aid" : data.aid,
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