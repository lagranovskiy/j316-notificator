var _ = require('lodash');
var postmark = require("postmark");
var config = require('../../config/config');

var PostmarkWorker = function () {
    var client = new postmark.Client(config.notificationAPI.postmark.apiToken);

    return {


        /**
         * Send email notification
         *
         * @param rqData
         * @param callback
         */
        sendEmail: function (emailRq, callback) {

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
                Tag: emailRq.tag,
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

module.exports = new PostmarkWorker();