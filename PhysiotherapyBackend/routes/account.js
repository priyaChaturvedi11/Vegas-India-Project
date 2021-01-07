var express = require('express'),
    router = express.Router(),
    AccountController = require('../controllers/account.js').default,
    UserRegistration = require('../models/user-registration.js').default,
    UserLogon = require('../models/user-logon.js').default,
    User = require('../models/user.js').default,
    UserSession = require('../models/user-session.js').default;
    ApiResponse = require('../models/api-response.js').default,
    UserPasswordReset = require('../models/user-pwd-reset.js').default,
    UserPasswordResetFinal = require('../models/user-pwd-reset-final.js').default,
    session = [],
    MailerMock = require('../test/mailer-mock.js'),
    mailer = new MailerMock();
router.route('/account/register')
    
    .post(function (req, res) {
        console.log(req.body);
        var accountController = new AccountController(User, req.session, UserSession, mailer);

        var userRegistration = new UserRegistration(req.body);

        // If there's no form data, send a bad request code.
        if (!userRegistration.mobileNumber) {
            res.status(400);
            return res.send('');
        }

        var apiResponseStep1 = accountController.getUserFromUserRegistration(userRegistration);

        res.set("Access-Control-Allow-Origin", "http://localhost:3000");   // Enable CORS in dev environment.

        if (apiResponseStep1.success) {
            accountController.register(apiResponseStep1.extras.user, function (err, apiResponseStep2) {

                console.log(apiResponseStep2);   
                return res.send(apiResponseStep2);
            });
        } else {        
            console.log(apiResponseStep1);    
            return res.send(apiResponseStep1);
        }
    });

router.route('/account/logon')
    .post(function (req, res) {
        console.log(req.body);

        var userSession = new UserSession(),
            accountController = new AccountController(User, req.session, userSession, mailer);

        var userLogon = new UserLogon(req.body);
        res.set("Content-Type", "application/json");
        res.set("Access-Control-Allow-Origin", "http://localhost:3000");   // Enable CORS in dev environment.

        accountController.logon(userLogon.mobileNumber, userLogon.password, function (err, response) {
            console.log(response);
            return res.send(response);
        });
    });

router.route('/account/logoff')

    .get(function (req, res) {

        var accountController = new AccountController(User, req.session, UserSession, mailer);
        accountController.logoff();
        res.send(new ApiResponse({ success: true }));
    })
    .post(function (req, res) {

        var accountController = new AccountController(User, req.session, UserSession, mailer);
        accountController.logoff();
        res.send(new ApiResponse({ success: true }));
    });

router.route('/account/resetpassword')
    .post(function (req, res) {

        var accountController = new AccountController(User, req.session, UserSession, mailer);
        var userPasswordReset = new UserPasswordReset(req.body);
        accountController.resetPassword(userPasswordReset.email, function (err, response) {
            return res.send(response);
        });
    });

router.route('/account/resetpasswordfinal')
    .post(function (req, res) {

        var accountController = new AccountController(User, req.session, UserSession, mailer);
        var userPasswordResetFinal = new UserPasswordResetFinal(req.body);
        accountController.resetPasswordFinal(userPasswordResetFinal.email, userPasswordResetFinal.newPassword, userPasswordResetFinal.newPasswordConfirm, userPasswordResetFinal.passwordResetHash, function (err, response) {
            return res.send(response);
        });
    });

module.exports = router;