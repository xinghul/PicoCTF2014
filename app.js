
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();

var Problem = require('./db_config').GetProblem();
var Team = require('./db_config').GetTeam();
var Achievement = require('./db_config').GetAchievement();
var Session = require('./db_config').GetSession();
var Teammate = require('./db_config').GetTeammate();

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
app.get('/*', function(req, res, next){
	res.setHeader('Last-Modified', (new Date()).toUTCString());
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});
app.post('/*', function(req, res, next){
	res.setHeader('Last-Modified', (new Date()).toUTCString());
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/problem', problem.GetProblem(Problem));
app.get('/team', team.GetTeam(Team));
app.get('/achievement', achievement.GetAchievement(Achievement));

app.post('/problemsolved', team.ProblemSolve(Team, Problem));
app.post('/achievementunlocked', team.AchievementUnlock(Team, Achievement));
app.post('/problemdisplayed', team.ProblemDisplayed(Team, Problem));
app.post('/achievementdisplayed', team.AchievementDisplayed(Team, Achievement));
app.get('/clearrecords', team.ClearRecords(Team, Teammate));

app.get('/newproblem', routes.newproblem);
app.get('/problemlist', problem.ShowProblems(Problem));
app.post('/addproblem', problem.AddProblem(Problem));
app.get('/removeproblem', problem.RemoveProblem(Problem));

app.get('/newteam', routes.newteam);
app.get('/teamlist', team.ShowTeams(Team));
app.post('/addteam', team.AddTeam(Team));
app.get('/removeteam', team.RemoveTeam(Team));

app.get('/newachievement', routes.newachievement);
app.get('/achievementlist', achievement.ShowAchievements(Achievement));
app.post('/addachievement', achievement.AddAchievement(Achievement));
app.get('/removeachievement', achievement.RemoveAchievement(Achievement));

app.get('/getsession', session.GetSession(Session));
app.post('/updatesession', session.UpdateSession(Session));


http.createServer(app).listen(app.get('port'), function(){
	console.log('PicoCTF server listening on port ' + app.get('port'));
});
