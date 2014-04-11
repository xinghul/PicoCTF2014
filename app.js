
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();

var db_problem = require('./db_config').InitProblemDB();
var db_team = require('./db_config').InitTeamDB();
var db_achievement = require('./db_config').InitAchievementDB();
var db_session = require('./db_config').InitSessionDB();

var problem = require('./routes/problemAPI');
var team = require('./routes/teamAPI');
var achievement = require('./routes/achievementAPI');
var session = require('./routes/sessionAPI');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/problem', problem.GetProblem(db_problem));
app.get('/team', team.GetTeam(db_team));
app.get('/achievement', achievement.GetAchievement(db_achievement));

app.get('/problemsolved', team.ProblemSolve(db_team, db_problem));
app.get('/achievementunlocked', team.AchievementUnlock(db_team, db_achievement));
app.get('/clearrecords', team.ClearRecords(db_team));

app.get('/newproblem', routes.newproblem);
app.get('/problemlist', problem.ShowProblems(db_problem));
app.post('/addproblem', problem.AddProblem(db_problem));

app.get('/newachievement', routes.newachievement);
app.get('/achievementlist', achievement.ShowAchievements(db_achievement));
app.post('/addachievement', achievement.AddAchievement(db_achievement));

app.get('/getsession', session.GetSession(db_session));
app.post('/updatesession', session.UpdateSession(db_session));

http.createServer(app).listen(app.get('port'), function(){
	console.log('PicoCTF server listening on port ' + app.get('port'));
});
