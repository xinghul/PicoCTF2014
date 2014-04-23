exports.GetTeam = function(Team) {
	return function(req, res) {
		var tid = req.query.tid;
		if (!tid)
			res.send({success : 0, msg : "Please specify the tid for the team."});
		else {
			console.log(req.ip + ' : GetTeam : ' + tid);
			Team.findOne({tid : tid}, function (err, team) {
				if (!err) {
					console.log('Success.');
					res.send(team);
				}
				else {
					console.log('Fail : ' + err);
					res.send({success : 0, msg : err});
				}
			});
		}
	};
};

exports.ClearRecords = function(Team, Teammate) {
	return function(req, res) {
		var tid = req.body.tid;
		console.log(req.ip + ' : ClearRecords : ' + tid);
		if (!tid)
			res.send({success : 0, msg : "Please specify the tid for the team."});
		else {
			Team.findOne({tid : tid}, function(err, team) {
				if (!err) {
					if ([undefined, null].indexOf(team) != -1) {
						console.log('Fail.');
						res.send({success : 0, msg : "Team " + tid + " does not exist!"});
						return;
					}
					console.log('Success.');
					var name = team.name;
					var teammates = [];
					for (var i = 1; i <= 6; i ++)
						teammates.push(new Teammate({username:'user' + i}));
					Team.create({tid:tid, name:name, teammates:teammates}, function (err, newTeam) {
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
					console.log('Fail : ' + err);
					res.send({success : 0, msg : err});
				}
			});
		}
	};
};

exports.ProblemSolve = function(Team, Problem) {
	return function(req, res) {
		var tid = req.body.tid;
		var pid = req.body.pid;
		if (!tid || !pid)
			res.send({success : 0, msg : "invalid parameters"});
		else {
			Problem.findOne({pid : pid}, function (err, problem) {
				if (err) {
					res.send({success : 0, msg : "These's an error while retrieving the problem info."});
					return;
				}
				if (!problem) {
					res.send({success : 0, msg : "Problem does not exist."});
					return;
				}
				var points = problem.points;
				Team.findOne({tid : tid}, function (err, team) {
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

exports.ProblemDisplayed = function(Team, Problem) {
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
		Problem.findOne({pid : data.pid}, function(err, problem) {
			if (err) {
				res.send({success : 0, msg : "Error occurs validating the problem info."});
				return;
			}
			if ([undefined, null].indexOf(problem) != -1) {
				res.send({success : 0, msg : "Problem does not exist."});
				return;
			}

			Team.update({tid : data.tid, 'teammates.username' : data.username}, {'$addToSet' : {'teammates.$.pdisplayed' : parseInt(data.pid)}}, function(err, count) {
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

exports.AchievementUnlock = function(Team, Achievement) {
	return function(req, res) {
		var tid = req.body.tid;
		var aid = req.body.aid;
		if (!aid || !tid)
			res.send({success : 0, msg : "invalid parameters"});
		else {
			console.log(req.ip + ' : AchievementUnlock : ' + tid + ' : ' + aid);
			Achievement.findOne({aid : aid}, function (err, achievement) {
				if (err) {
					res.send({success : 0, msg : "These's an error while retrieving the achievement info."});
					return;
				}
				if ([undefined, null].indexOf(achievement) != -1) {
					res.send({success : 0, msg : "Achievement does not exist."});
					return;
				}
				Team.findOne({tid : tid}, function (err, team) {
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

exports.AchievementDisplayed = function(Team, Achievement) {
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
		Achievement.findOne({aid : data.aid}, function(err, achievement) {
			if (err) {
				res.send({success : 0, msg : "Error occurs validating the achievement info."});
				return;
			}
			if ([undefined, null].indexOf(achievement) != -1) {
				res.send({success : 0, msg : "Achievement does not exist."});
				return;
			}

			Team.update({tid : data.tid, 'teammates.username' : data.username}, {'$addToSet' : {'teammates.$.adisplayed' : parseInt(data.aid)}}, function(err, count) {
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