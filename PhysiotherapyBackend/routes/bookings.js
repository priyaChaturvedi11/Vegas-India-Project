var express = require('express'),
    router = express.Router(),
    BookingsController = require('../controllers/bookings.js').default,
    Booking = require('../models/booking.js').default,
    UserSession = require('../models/user-session.js').default,
    ApiResponse = require('../models/api-response.js').default;
    ApiMessages = require('../models/api-messages.js').default;

router.route('/bookings/')
.get(function (req, res) {

    var bookingsController = new BookingsController(Booking);

    UserSession.findOne({ sessionId: req.get('X-Auth-Token') }, function (err, session) {
        
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (session) {

            // TODO: Sanitize query string.

            bookingsController.getBookings(
                session.userId,
                req.query.fromDate,
                req.query.toDate,
                req.query.page,
                req.query.pageSize,
                req.query.sortColumn,
                req.query.sortDir,
                function (err, apiResponse) {

                    return res.send(apiResponse);
                });

        } else {
            return res.send(new ApiResponse({ success: false, extras: { msg: ApiMessages.EMAIL_NOT_FOUND } }));
        }
    });
   
});

module.exports = router;