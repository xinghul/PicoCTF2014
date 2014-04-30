var mongoose = require('mongoose');
var monk = require('monk');
var db_name = "pico";
var db = mongoose.connect("mongodb://127.0.0.1:27017/" + db_name);
console.log("Connected to database " + db_name);


var problemSchema = mongoose.Schema({
	pid: {
		type: Number,
		min: 1,
		max: 200,
		default: -1
	},
	type: {
		type: String,
		default: ""
	},
	name: {
		type: String,
		default: ""
	},
	points: {
		type: Number,
		default: 0
	},
	desc: {
		type: String,
		default: ""
	},
	hint: {
		type: String,
		default: ""
    },
    ans: {
    	type: String,
    	default: ""
    }
});

var teamSchema = mongoose.Schema({
	tid: {
		type: Number,
		default: -1
	},
	name: {
		type: String,
		default: ""
	},
	teammates: [teammateSchema],
	achievements: [Number],
	problemsolved: [Number],
	points: {
		type: Number,
		default: 0
	},

});
var teammateSchema = mongoose.Schema({
	username: {
		type: String,
		default: ""
	},
	pdisplayed: [Number],
	adisplayed: [Number]
});

var teamInfoSchema = mongoose.Schema({
	tid: {
		type: Number,
		default: -1
	},
	username: {
		type: String,
		default: ""
	},
	password: {
		type: String,
		default: ""
	}
});


var sessionSchema = mongoose.Schema({
	username: {
		type: String,
		default: ""
	},
	eid: {
		type: Number,
		default: -1
	},
	aid: {
		type: Number,
		default: -1
	},
	tid: {
		type: Number,
		default: -1
	},
	pos: {
		x: {
			type: Number,
			default: -1
		},
		y: {
			type: Number,
			default: -1
		}
	},
	level: {
		type: String,
		default: ""
	}
});

var achievementSchema = mongoose.Schema({
	aid: {
		type: Number,
		min: 1,
		max: 30,
		default: -1
	},
	name: {
		type: String,
		default: ""
	},
	desc: {
		type: String,
		default: ""
	}
});



exports.GetProblem = function() {
	return mongoose.model('Problem', problemSchema);
};

exports.GetTeam = function() {
	return mongoose.model('Team', teamSchema);
};

exports.GetTeammate = function() {
	return mongoose.model('Teammate', teammateSchema);
};

exports.GetAchievement = function() {
	return mongoose.model('Achievement', achievementSchema);
};

exports.GetSession = function() {
	return mongoose.model('Session', sessionSchema);
};
