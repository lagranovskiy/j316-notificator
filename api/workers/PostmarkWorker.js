var _ = require('lodash');
var postmark = require("postmark");
var async = require('async');
var config = require('../../config/config');

var PostmarkWorker = function () {
    var client = new postmark.Client(config.notificationAPI.postmark.apiToken);

    return {


        /**
         * Sends a new templated message
         *
         * @param recipient email of recipient
         * @param subject subject
         * @param messageObject object with vars
         * @param callback
         * @return {*}
         */
        sendTemplatedMessage: function (recipient, messageObject, callback) {


            // Validate that we have all we need
            if (!recipient) {
                return callback('No Recipients - No notification');
            }

            if (!messageObject) {
                return callback('No message- No notification');
            }


            async.waterfall([function (asyncCallback) {
                // See doku http://developer.postmarkapp.com/developer-api-templates.html#email-with-template
                console.info('Sending email to ' + recipient);
                client.sendEmailWithTemplate({
                    From: config.notificationAPI.postmark.senderEmail,
                    To: recipient,
                    TemplateId: config.notificationAPI.postmark.defaultTemplateId*1,
                    TemplateModel: messageObject
                }, asyncCallback);

            }], function (error, result) {
                if (error) {
                    console.error("Unable to send via postmark: " + error.message);
                    return callback(error);
                }
                return callback(null, result);
            });

        },

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

module.exports = new PostmarkWorker();