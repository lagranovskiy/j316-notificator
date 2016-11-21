var _ = require('lodash');
var config = require('../../config/config');
var requestify = require('requestify');

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


            requestify.post(config.notificationAPI.google.calAPI, JSON.stringify(evRq), {})
                .then(function (response) {
                    var res = response.getBody();
                    if (response.getCode() == 200) {
                        console.info('Calender entry created successfully');
                        return callback(null, {success: true, result: res});
                    } else {
                        return callback(null, {
                            success: false,
                            errorMessage: response.getCode()
                        });
                    }
                })
                .fail(function (response) {
                    console.error('Cannot communicate with google calender api: ' + JSON.stringify(response));
                    return callback(null, {success: false, errorMessage: response.message});
                });
        }

    };

};

module.exports = new GoogleCalWorker();