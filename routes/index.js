
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'PicoCTF2014' });
};


exports.newproblem = function(req, res) {
	res.render('newproblem', { title : 'Add New Problem'});
};

exports.newachievement = function(req, res) {
	res.render('newachievement', { title : 'Add New Achievement'});
};