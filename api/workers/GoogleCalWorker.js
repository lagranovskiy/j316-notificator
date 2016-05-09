var _ = require('lodash');
var postmark = require("postmark");
var config = require('../../config/config');

var google = require('googleapis');
var googleAuth = require('google-auth-library');

var googleAuthInfo = JSON.parse(config.notificationAPI.google.accessJSON);
var jwtClient = new googleAuth.JWT();
jwtClient.fromJSON(googleAuthInfo, function () {
    console.info('Authentication google prepared')
});

var GoogleCalWorker = function () {
    var client = new postmark.Client(config.notificationAPI.postmark.apiToken);

    return {


        /**
         * Creates a new Calender Event
         *
         * @param evRq
         * @param callback
         */
        createCalenderEvent: function (evRq, callback) {

            // Validate that we have all we need
            if (!emailRq.email) {
                return callback('No Email- No notification');
            }
            if (!emailRq.subject) {
                return callback('No subject- No notification');
            }
            if (!emailRq.message) {
                return callback('No message- No notification');
            }


            client.sendEmail({
                From: config.notificationAPI.postmark.senderEmail,
                To: emailRq.email,
                Subject: emailRq.subject,
                TextBody: emailRq.message,
                Tag: emailRq.tag
            }, function (error, success) {
                if (error) {
                    console.error("Unable to send via postmark: " + error.message);
                    return callback(error);
                }
                callback(null, success);
            });
        }

    };

};

module.exports = new GoogleCalWorker();