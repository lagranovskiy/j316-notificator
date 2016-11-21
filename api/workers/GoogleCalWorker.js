var _ = require('lodash');
var config = require('../../config/config');
var request = require('request');

var GoogleCalWorker = function () {

    return {


        /**
         * Creates a new Calender Event
         *
         *  {
                action: "add",
                calender: "Büchertisch 1",
                eventName: "Gruppe 2 - Büchertisch",
                eventDescription: "Lieber Bruder du bist dran",
                startDate: "2017-01-10T10:00:00.000Z",
                endDate: "2017-01-10T12:00:00.000Z",
                guests: "test@agranovskiy.de",
                reminders: [1, 3],
                location: "Mainzer Landstrasse 87, Frankfurt am Main"
            }
         *
         * @param evRq
         * @param callback
         */
        createCalenderEvent: function (evRq, callback) {

            // Validate that we have all we need
            if (!evRq.guests) {
                return callback('No Email- No notification');
            }
            if (!evRq.calender) {
                return callback('No calenderName - No notification');
            }
            if (!evRq.eventName) {
                return callback('No eventName- No notification');
            }


            var options = {
                uri: config.notificationAPI.google.calAPI,
                method: 'POST',
                followAllRedirects: true,
                json: evRq
            };

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.info('Calender entry created successfully');
                    return callback(null, {success: true, result: body});
                } else if (!error) {
                    return callback(null, {
                        success: false,
                        errorMessage: response
                    });
                } else {
                    console.error('Cannot communicate with google calender api: ' + JSON.stringify(response));
                    return callback(null, {
                        success: false,
                        errorMessage: error
                    });
                }
            });
        }
    };
};

module.exports = new GoogleCalWorker();