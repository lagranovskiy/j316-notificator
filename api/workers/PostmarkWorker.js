var mongoose = require('mongoose'),
    _ = require('lodash');
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
        sendEmail: function (notification, callback) {

            // Validate that we have all we need
            notification.recipient.name;
            notification.recipient.email;
            notification.subject;
            notification.message;

            client.sendEmail({
                From: config.notificationAPI.postmark.senderEmail,
                To: notification.recipient.email,
                Subject: notification.subject,
                TextBody: notification.message,
                Tag: _.first(notification.category)
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