exports.GetTeam = function(db) {
	return function(req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		var tid = req.query.tid;
		if (!tid)
			res.send({success : 0, msg : "Please specify the tid for the team."});
		else {
			console.log(req.ip + ' : GetTeam : ' + tid);
			db.findOne({tid : tid}, function (err, team) {
				if (!err) {
					console.log('Success.');
					res.send(team);
				}
				else {
					console.log('Fail.');
					console.log(err);
					res.send({success : 0, msg : err});
				}
			});
		}
	};
};

exports.ClearRecords = function(db) {
	return function(req, res) {
		var tid = req.query.tid;
		console.log(req.ip + ' : ClearRecords : ' + tid);
		if (!tid)
			res.send({success : 0, msg : "Please specify the tid for the team."});
		else {
			db.findOne({tid : tid}, function(err, team) {
				if (!err) {
					if ([undefined, null].indexOf(team) != -1) {
						console.log('Fail.');
						res.send({success : 0, msg : "Team " + tid + " does not exist!"});
						return;
					}
					console.log('Success.');
					var name = team.name;
					db.create({tid:tid, name:name, teammates:[{username:'user1', pdisplayed:[], adisplayed:[]}, {username:'user2', pdisplayed:[], adisplayed:[]}]}, function (err, newTeam) {
						if (!err) {
							team.remove();
							res.send({success : 1, msg : "Records of team " + tid + " cleared!"});
						}
						else {
							res.send({success : 0, msg : err});
						}
					});
					
				}
				else {
					console.log('Fail.');
					console.log(err);
					res.send({success : 0, msg : err});
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

exports.ProblemDisplayed = function(db_team, db_problem) {
	return function(req, res) {
		var data = req.body;
		console.log(req.ip + ' : ProblemDisplayed');
		console.log(data);
		if ([undefined, null].indexOf(data.username) != -1 ||
			[undefined, null].indexOf(data.tid) != -1 ||
			[undefined, null].indexOf(data.pid) != -1) {
			console.log('Fail : Invalid arguments.');
			res.send({success : 0, msg : "Invalid arguments."});
			return;
		}
		db_problem.findOne({pid : data.pid}, function(err, problem) {
			if (err) {
				res.send({success : 0, msg : "Error occurs validating the problem info."});
				return;
			}
			if ([undefined, null].indexOf(problem) != -1) {
				res.send({success : 0, msg : "Problem does not exist."});
				return;
			}

			db_team.update({tid : data.tid, 'teammates.username' : data.username}, {'$addToSet' : {'teammates.$.pdisplayed' : parseInt(data.pid)}}, function(err, count) {
				if (err) {
					res.send({success : 0, msg : err});
					return;
				}
				else {
					res.send({success : 1, msg : "Problem displayed for player " + data.username + " updated."});
					return;
				}
			});
		});
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
				if ([undefined, null].indexOf(achievement) != -1) {
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

exports.AchievementDisplayed = function(db_team, db_achievement) {
	return function(req, res) {
		var data = req.body;
		console.log(req.ip + ' : AchievementDisplayed');
		console.log(data);
		if ([undefined, null].indexOf(data.username) != -1 ||
			[undefined, null].indexOf(data.tid) != -1 ||
			[undefined, null].indexOf(data.aid) != -1) {
			console.log('Fail : Invalid arguments.');
			res.send({success : 0, msg : "Invalid arguments."});
			return;
		}
		db_achievement.findOne({aid : data.aid}, function(err, achievement) {
			if (err) {
				res.send({success : 0, msg : "Error occurs validating the achievement info."});
				return;
			}
			if ([undefined, null].indexOf(achievement) != -1) {
				res.send({success : 0, msg : "Achievement does not exist."});
				return;
			}

			db_team.update({tid : data.tid, 'teammates.username' : data.username}, {'$addToSet' : {'teammates.$.adisplayed' : parseInt(data.aid)}}, function(err, count) {
				if (err) {
					res.send({success : 0, msg : err});
					return;
				}
				else {
					res.send({success : 1, msg : "Achievement displayed for player " + data.username + " updated."});
					return;
				}
			});
		});
	};
};