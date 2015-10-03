var mongoose = require('mongoose'),
    config = require('../../config/config'),
    _ = require('lodash'),
    Notification = mongoose.model('Notification');
var async = require('neo-async');

var PostmarkWorker = require('../workers/PostmarkWorker');

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

    callback(null, notification);
};

/**
 * Send message to the worker and process response
 *
 * @param notification
 * @param callback
 */
PostmanOffice.prototype.sendEmail = function (notification, callback) {
    console.info('Sending Email to ' + notification.recipient.name);

    PostmarkWorker.sendEmail(notification, function (err, result) {
        if (err) {
            console.error(err);
            notification.confirmReciept('error', err);
            return callback(err);
        }
        console.info('Email Message was sent successfully: ' , notification.recipient.name);
        notification.confirmReciept('Sending completed', result);
        return callback(null, notification);
    });
};


module.exports = new PostmanOffice();