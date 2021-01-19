var express = require('express');
var router = express.Router();
var User = require('../models/user');
//var rest_api_call = require('./rest_api_call');
var http = require('http');
router.get('/', function (req, res) {
	return res.render('index.ejs');
});


router.post('/register', function (req, res) {
	console.log('body: ');
	console.log(req.body);
	var personInfo = req.body;
	var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

	if (!personInfo.mobile_number || !personInfo.year_of_birth || !personInfo.title || !personInfo.first_name || !personInfo.last_name || !personInfo.password || !personInfo.passwordConf) {
		res.send('fail');
	} else {
		if (personInfo.password == personInfo.passwordConf) {
			User.mobileNumber = personInfo.mobile_number;
			User.email = personInfo.email;
			User.yob = personInfo.year_of_birth;
			User.title = personInfo.title;
			User.firstName = personInfo.first_name;
			User.lastName = personInfo.last_name;
			User.password = personInfo.password;
			User.passwordConfirm = personInfo.passwordConf;
			jsonObject = JSON.stringify(User);

			// prepare the header
			var postheaders = {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
			};

			// the post options
			var optionspost = {
				host: '127.0.0.1',
				port: 30000,
				path: '/api/account/register',
				method: 'POST',
				headers: postheaders
			};

			console.info('Options prepared:');
			console.info(optionspost);
			console.info('Do the POST call');

			// do the POST call
			var reqPost = http.request(optionspost, function (res1) {
				console.log("statusCode: ", res1.statusCode);
				// uncomment it for header details
				// console.log("headers: ", res.headers);
				var dtext = '';
				res1.on('data', function (chunk) {
					console.info('POST result:\n');
					dtext += chunk;
				});
				//the whole response has been recieved, so we just print it out here
				res1.on('end', function () {
					var d = JSON.parse(dtext);
					console.info('POST result:\n');
					console.log(d);
					console.info('\n\nPOST completed');
					if (d.success) {
						return res.send({ "Success": "You are registered,You can login now." });
					}
					else {
						if(d.extras.msg == 5)
							return res.send({ "Success": "Mobile Number is already used." });
						else
							return res.send({ "Success": "Please try again later!!" });
					}
				});
			});

			// write the json data
			reqPost.write(jsonObject);
			reqPost.end();
			reqPost.on('error', function (e) {
				console.error(e);
			});
		}
		else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

router.get('/login', function (req, res) {
	return res.render('login.ejs');
});


router.get('/home', function(req, res, next){
	return res.render("home.ejs");
});

router.get('/charts', function(req, res, next){
	return res.render("charts.ejs");
});

router.get('/start_plan', function(req, res, next){
	return res.render("start_plan.ejs");
});


router.post('/login', function (req, res) {
	console.log('body: ');
	console.log(req.body);
	var personInfo = req.body;
	User.mobileNumber = personInfo.mobile_number;
	User.password = personInfo.password;
	jsonObject = JSON.stringify(User);

	// prepare the header
	var postheaders = {
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
	};

	// the post options
	var optionspost = {
		host: '127.0.0.1',
		port: 30000,
		path: '/api/account/logon',
		method: 'POST',
		headers: postheaders
	};

	console.info('Options prepared:');
	console.info(optionspost);
	console.info('Do the POST call');

	// do the POST call
	var reqPost = http.request(optionspost, function (res1) {
		console.log("statusCode: ", res1.statusCode);
		// uncomment it for header details
		// console.log("headers: ", res1.headers);
		var dtext = '';
		res1.on('data', function (chunk) {
			console.info('POST result:\n');
			dtext += chunk;
		});
		//the whole response has been recieved, so we just print it out here
		res1.on('end', function () {
			var d = JSON.parse(dtext);
			console.log(d);
			console.info('\n\nPOST completed');
			if (d.success) {
				req.session.userId = d.unique_id;
				return res.send({ "Success": "Success!" });
			}
			else {
				if(d.extras.msg == 1)
					return res.send({ "Success": "This Email Is not regestered!" });
				else
					return res.send({ "Success": "Wrong password!" });
			}
		});
	});

	// write the json data
	reqPost.write(jsonObject);
	reqPost.end();
	reqPost.on('error', function (e) {
		console.error(e);
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/');
		} else {
			//console.log("found");
			return res.render('data.ejs', { "name": data.username, "email": data.email });
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, data) {
		console.log(data);
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
			// res.send({"Success":"Success!"});
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save(function (err, Person) {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});

module.exports = router;