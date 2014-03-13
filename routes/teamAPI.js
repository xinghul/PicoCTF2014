exports.GetTeam = function(db) {
	return function(req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		var tid = req.query.tid;
		if (!tid)
			res.send({success : 0, msg : "Please specify the tid for the team."});
		else {
			console.log(req.ip + ' : GetTeam : ' + tid);
			db.findOne({tid : tid}, function (err, team) {
				if (!err)
				{
					console.log('Success.');
					res.send(team);
				}
				else 
				{
					console.log('Fail.');
					res.send({success : 0, msg : "These's an error while retrieving the team info."});
				}
			});
		}
	};
};

exports.ClearRecords = function(db) {
	return function(req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		var tid = req.query.tid;
		if (!tid)
			res.send({success : 0, msg : "Please specify the tid for the team."});
		else {
			console.log(req.ip + ' : ClearRecords : ' + tid);
			db.update({tid : tid}, {$set : {achievements : [], problemsolved : [], points : 0}}, function(err, doc) {
				if (!err)
				{
					console.log('Success.');
					res.send({success : 1, msg : "Successful clear the team records."});
				}
				else 
				{
					console.log('Fail.');
					res.send({success : 0, msg : "These's an error while clearing the team records."});
				}
			});
		}
	};
};

exports.ProblemSolve = function(db, db_problem) {
	return function(req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		var tid = req.query.tid;
		var pid = req.query.pid;
		if (!tid || !pid)
			res.send({success : 0, msg : "invalid parameters"});
		else {
			db_problem.findOne({pid : pid}, function (err, problem) {
				if (err) {
					res.send({success : 0, msg : "These's an error while retrieving the problem info."});
					return;
				}
				if (!problem) {
					res.send({success : 0, msg : "Problem does not exist."});
					return;
				}
				var points = problem.points;
				db.findOne({tid : tid}, function (err, team) {
					if (err) {
						res.send({success : 0, msg : "These's an error while updating the team info."});
						return;
					}
					if (team.problemsolved.indexOf(pid) == -1) {
						team.problemsolved.addToSet(pid);
						team.points += points;
						team.save();
						res.send({success : 1, msg : "Correct Answer."});
					} else {
						res.send({success : 0, msg : "Problem already solved!"});
					}
				});
			});
		}
	};
};

exports.AchievementUnlock = function(db, db_achievement) {
	return function(req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		var tid = req.query.tid;
		var aid = req.query.aid;
		if (!aid || !tid)
			res.send({success : 0, msg : "invalid parameters"});
		else {
			console.log(req.ip + ' : AchievementUnlock : ' + tid + ' : ' + aid);
			db_achievement.findOne({aid : aid}, function (err, achievement) {
				if (err) {
					res.send({success : 0, msg : "These's an error while retrieving the achievement info."});
					return;
				}
				if (!achievement) {
					res.send({success : 0, msg : "Achievement does not exist."});
					return;
				}
				db.findOne({tid : tid}, function (err, team) {
					if (err) {
						res.send({success : 0, msg : "These's an error while updating the team info."});
						return;
					}
					if (team.achievements.indexOf(aid) == -1) {
						console.log('Success.');
						team.achievements.addToSet(aid);
						team.save();
						res.send({success : 1, msg : "Achievement unlocked."});
					} else {
						console.log('Fail.');
						res.send({success : 0, msg : "Achievement already unlocked!"});
					}
				});
			});
		}
	};
};
