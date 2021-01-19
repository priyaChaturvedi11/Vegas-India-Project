export class AccountController {
    constructor(userModel, session, userSession, mailer) {
        this.crypto = require('crypto');
        this.uuid = require('uuid');
        this.ApiResponse = require('../models/api-response.js').default;
        this.ApiMessages = require('../models/api-messages.js').default;
        this.UserProfile = require('../models/user-profile.js').default;
        this.userModel = userModel;
        this.session = session;
        this.userSession = userSession;
        this.mailer = mailer;
        this.User = require('../models/user.js').default;
    }
    getSession() {
        return this.session;
    }
    setSession(session) {
        this.session = session;
    }
    hashPassword(password, salt, callback) {
        // We use pbkdf2 to hash and iterate 10k times by default 
        var iterations = 10000,
            keyLen = 64, // 64 bit.
            digest = 'sha512';
        this.crypto.pbkdf2(password, salt, iterations, keyLen, digest, callback);
    }
    register(newUser, callback) {
        var me = this;
        me.userModel.findOne({ email: newUser.email }, function (err, user) {

            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }

            if (user) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.EMAIL_ALREADY_EXISTS } }));
            } else {

                newUser.save(function (err, user, numberAffected) {

                    if (err) {
                        return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                    }

                    if (numberAffected === 1) {

                        var userProfileModel = new me.UserProfile({
                            mobileNumber: user.mobileNumber,
                            firstName: user.firstName,
                            lastName: user.lastName
                        });

                        return callback(err, new me.ApiResponse({
                            success: true, extras: {
                                userProfileModel: userProfileModel
                            }
                        }));
                    } else {
                        return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE_USER } }));
                    }

                });
            }

        });
    }
    logon(mobileNumber, password, callback) {

        var me = this;

        me.userModel.findOne({ mobileNumber: mobileNumber }, function (err, user) {

            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }

            if (user && user.passwordSalt) {
                console.log(user);
                me.hashPassword(password, user.passwordSalt, function (err, passwordHash) {

                    if (passwordHash == user.passwordHash) {

                        var userProfileModel = new me.UserProfile({
                            mobileNumber: user.mobileNumber,
                            firstName: user.firstName,
                            lastName: user.lastName
                        });

                        // Save to http session.
                        me.session.userProfileModel = userProfileModel;
                        //me.session.id = me.uuid.v4();

                        // Save to persistent session.
                        me.userSession.userId = user._id;
                        me.userSession.sessionId = me.session.id;

                        me.userSession.save(function (err, sessionData, numberAffected) {
                            console.log(sessionData);
                            console.log(numberAffected);
                            if (err) {
                                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                            }
                            if (sessionData) {
                                // Return the user profile so the router sends it to the client app doing the logon.
                                return callback(err, new me.ApiResponse({
                                    success: true, extras: {
                                        userProfileModel: userProfileModel,
                                        sessionId: me.session.id
                                    }
                                }));
                            } else {

                                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE_SESSION } }));
                            }
                        });
                    } else {
                        return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_PWD } }));
                    }
                });
            } else {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.EMAIL_NOT_FOUND } }));
            }

        });
    }
    logoff() {
        if (this.session.userProfileModel)
            delete this.session.userProfileModel;
        if (this.session.id)
            delete this.session.id;
        return;
    }
    resetPassword(email, callback) {
        var me = this;
        me.userModel.findOne({ email: email }, function (err, user) {

            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }

            if (user) {
                // Save the user's email and a password reset hash in session.
                var passwordResetHash = me.uuid.v4();
                me.session.passwordResetHash = passwordResetHash;
                me.session.emailWhoRequestedPasswordReset = email;

                me.mailer.sendPasswordResetHash(email, passwordResetHash);

                return callback(err, new me.ApiResponse({ success: true, extras: { passwordResetHash: passwordResetHash } }));
            } else {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.EMAIL_NOT_FOUND } }));
            }
        });
    }
    resetPasswordFinal(email, newPassword, newPasswordConfirm, passwordResetHash, callback) {
        var me = this;
        if (!me.session || !me.session.passwordResetHash) {
            return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_EXPIRED } }));
        }

        if (me.session.passwordResetHash !== passwordResetHash) {
            return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_HASH_MISMATCH } }));
        }

        if (me.session.emailWhoRequestedPasswordReset !== email) {
            return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH } }));
        }

        if (newPassword !== newPasswordConfirm) {
            return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_CONFIRM_MISMATCH } }));
        }

        var passwordSalt = this.uuid.v4();

        me.hashPassword(newPassword, passwordSalt, function (err, passwordHash) {

            me.userModel.update({ email: email }, { passwordHash: passwordHash, passwordSalt: passwordSalt }, function (err, numberAffected, raw) {

                if (err) {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                }

                if (numberAffected < 1) {

                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_RESET_PASSWORD } }));
                } else {
                    return callback(err, new me.ApiResponse({ success: true, extras: null }));
                }
            });
        });
    }
    getUserFromUserRegistration(userRegistrationModel) {
        try {
            var me = this;

            if (userRegistrationModel.password !== userRegistrationModel.passwordConfirm) {
                return new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_CONFIRM_MISMATCH } });
            }

            var passwordSaltIn = this.uuid.v4(),
                cryptoIterations = 10000,
                cryptoKeyLen = 64,
                passwordHashIn,
                cryptoDigest = 'sha512';

            var user = new this.User({
                mobileNumber: userRegistrationModel.mobileNumber,
                title: userRegistrationModel.title,
                yob: userRegistrationModel.yob,
                email: userRegistrationModel.email,
                firstName: userRegistrationModel.firstName,
                lastName: userRegistrationModel.lastName,
                passwordHash: this.crypto.pbkdf2Sync(userRegistrationModel.password, passwordSaltIn, cryptoIterations, cryptoKeyLen, cryptoDigest),
                passwordSalt: passwordSaltIn,
                registeration_date: Date.now()
            });

            return new me.ApiResponse({ success: true, extras: { user: user } });
        }
        catch (e) {
            console.log(e);
            return new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE_USER } });
        }
    }
}
