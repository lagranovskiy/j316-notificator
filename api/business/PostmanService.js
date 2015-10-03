var mongoose = require('mongoose'),
    _ = require('lodash'),
    Notification = mongoose.model('Notification');
var async = require('neo-async');

var PostmarkWorker = require('../workers/PostmarkWorker');
var SMS77Worker = require('../workers/SMS77Worker');

var PostmanOffice = function () {
};

/**
 * Service processes notification if any are to be done
 */
PostmanOffice.prototype.processNotification = function (callback) {

    Notification.getDueNotifications(function (err, data) {
            if (err) {
                return callback(err);
            }
            var notificationReciept = {
                sms: 0,
                email: 0
            };
            var tasks = [];

            _.forEach(data, function (notification) {
                notification.startProcess();

                if (notification.notificationType.indexOf('sms') != -1) {
                    tasks.push(function (done) {
                        PostmanOffice.prototype.sendSMS(notification, done);
                    });
                    notificationReciept.sms++;

                }

                if (notification.notificationType.indexOf('email') != -1) {
                    tasks.push(function (done) {
                        PostmanOffice.prototype.sendEmail(notification, done);
                    });
                    notificationReciept.email++;
                }

            });


            callback(null, {
                timestamp: new Date().getTime(),
                startedNotifications: data.length,
                started: notificationReciept
            });

            async.parallel(tasks, function (err, completed) {
                if (err) {
                    return callback(err);
                }
                _.forEach(completed, function (notification) {
                    notification.completeProcess('notification processed');
                });

                console.log('Execution completed');


            });


        }
    )
    ;

};


PostmanOffice.prototype.sendSMS = function (notification, callback) {
    console.info('Sending SMS to ' + notification.recipient.name);

    var smsRq = {
        message: notification.message,
        mobile: notification.recipient.mobile
    };

    SMS77Worker.sendSMS(smsRq, function (err, result) {
        if (err) {
            console.error(err);
            notification.recipe('error' + err);
            return callback(err);
        }
        console.info('SMS Message was sent successfully: ', notification.recipient.name);
        notification.recipe(result);
        return callback(null, notification);
    });
};

/**
 * Send message to the worker and process response
 *
 * @param notification
 * @param callback
 */
PostmanOffice.prototype.sendEmail = function (notification, callback) {
    console.info('Sending Email to ' + notification.recipient.name);

    // Validate that we have all we need
    if (!notification.recipient.email) {
        return callback('No Email- No notification');
    }
    if (!notification.subject) {
        return callback('No subject- No notification');
    }
    if (!notification.message) {
        return callback('No message- No notification');
    }

    var emailRq = {
        email: notification.recipient.email,
        subject: notification.subject,
        message: notification.message,
        tag: _.first(notification.category)
    };

    PostmarkWorker.sendEmail(emailRq, function (err, result) {
        if (err) {
            console.error(err);
            notification.recipe('error' + err);
            return callback(err);
        }
        console.info('Email Message was sent successfully: ', notification.recipient.name);
        notification.recipe(result);
        return callback(null, notification);
    });
};


module.exports = new PostmanOffice();