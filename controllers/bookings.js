class BookingsController {
    constructor(bookingModel) {
        this.ApiResponse = require('../models/api-response.js').default;
        this.ApiMessages = require('../models/api-messages.js').default;
        this.bookingModel = bookingModel;
    }
    getBookings(userId, fromDate, toDate, page, pageSize, sortColumn, sortDir, callback) {

        var me = this;

        var query = {
            ownerUserId: userId,
            fromDate: { '$gte': fromDate },
            toDate: { '$lt': toDate }
        };

        me.bookingModel.find(query)
            .sort({
                sortColumn: sortDir
            })
            .skip(pageSize * page)
            .limit(pageSize)
            .exec(function (err, bookings) {
                if (err) {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                }

                return callback(err, new me.ApiResponse({ success: true, extras: { bookings: bookings } }));
            });
    }
}
export default BookingsController;