exports.GetProblem = function(Problem) {
	return function(req, res) {
		res.setHeader('Last-Modified', (new Date()).toUTCString());
		res.setHeader('Access-Control-Allow-Origin', '*');
		var pid = req.query.pid;
		console.log(req.ip + ' : GetProblem : ' + pid);
		if (!pid)
			res.send({success : 0, msg : "Please specify the pid for the problem."});
		else {
			Problem.findOne({pid : pid}, function (err, problem) {
				if (!err)
				{
					console.log('Success.');
					res.send(problem);
				}
				else 
				{
					console.log('Fail.');
					res.send({success : 0, msg : "These's an error while retrieving the problem info."});
				}
			});
		}
	};
};

exports.RemoveProblem = function(Problem) {
	return function(req, res) {
		res.setHeader('Last-Modified', (new Date()).toUTCString());
		res.setHeader('Access-Control-Allow-Origin', '*');
		var pid = req.query.pid;
		console.log(req.ip + ' : RemoveProblem : ' + pid);
		if (!pid)
			res.send({success : 0, msg : "Please specify the pid for the problem."});
		else {
			Problem.remove({pid : pid}, function (err, problem) {
				if (!err)
				{
					console.log('Success.');
					res.send({success : 1, msg : "Successfully removed problem " + pid + "."});
				}
				else 
				{
					console.log('Fail.');
					res.send({success : 0, msg : "Error occurs while removing the problem."});
				}
			});
		}
	};
};

exports.AddProblem = function(Problem) {
	return function(req, res) {
		res.setHeader('Last-Modified', (new Date()).toUTCString());
		res.setHeader('Access-Control-Allow-Origin', '*');
		var pid = req.body.pid;
		var type = req.body.type;
		var name = req.body.name;
		var points = req.body.points;
		var desc = req.body.desc;
		var hint = req.body.hint;
		var ans = req.body.ans;

		Problem.findOne({pid : pid}, function (err, problem) {
			if (err | problem != null) {
				res.send({success : 0, msg : "Problem already exists."});
				return;
			}
			Problem.create({
				"pid" : pid,
				"type" : type,
				"name" : name,
				"points" : points,
				"desc" : desc,
				"hint" : hint,
				"ans" : ans
			}, function(err, doc) {
				if (err) {
					console.log(err);
					res.send({success : 0, msg : "Error occurs when adding the problem to database"});
					return;
				} else {
					res.location('problemlist');
					res.redirect('problemlist');
				}
			});
		});
	};
};


exports.ShowProblems = function(Problem) {
	return function(req, res) {
		res.setHeader('Last-Modified', (new Date()).toUTCString());
		res.setHeader('Access-Control-Allow-Origin', '*');
		Problem.find({}, {}, function(e, problems) {
			res.render('problemlist', {
				'title' : 'Problem List',
				'problemlist' : problems
			});
		});
	};
};

