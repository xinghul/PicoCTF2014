exports.GetAchievement = function(Achievement) {
	return function(req, res) {
		var aid = req.query.aid;
		console.log(aid);
		if (!aid)
			res.send("Please specify the aid for the achievement.");
		else {
			Achievement.findOne({aid : aid}, function (err, achievement) {
				console.log(achievement);
				if (!err)
					res.send(achievement);
				else 
					res.send("These's an error while retrieving the achievement info.");
			});
		}
	};
};

exports.AddAchievement = function(Achievement) {
	return function(req, res) {
		var aid = req.body.aid;
		var name = req.body.name;
		var desc = req.body.desc;

		Achievement.findOne({aid : aid}, function (err, achievement) {
			if (err | achievement != null) {
				res.send({success : 0, msg : "Achievement already exists."});
				return;
			}
			Achievement.create({
				"aid" : aid,
				"name" : name,
				"desc" : desc
			}, function(err, doc) {
				if (err) {
					console.log(err);
					res.send({success : 0, msg : "Error occurs when adding the achievement to database"});
					return;
				} else {
					res.location('achievementlist');
					res.redirect('achievementlist');
				}
			});
		});
	};
};


exports.ShowAchievements = function(Achievement) {
	return function(req, res) {
		Achievement.find({}, {}, function(e, achievements) {
			res.render('achievementlist', {
				'title' : 'Achievement List',
				'achievementlist' : achievements
			});
		});
	};
};