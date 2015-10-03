var mongoose = require('mongoose'),
    moment = require('moment'),
    _ = require('lodash'),
    path = require('path'),
    config = require('../../config/config'),
    fs = require('fs'),
    async = require('neo-async'),
    Notification = mongoose.model('Notification');
var PostmarkWorker = require('../workers/PostmarkWorker');

var InfoOffice = function () {
};


InfoOffice.prototype.createReport = function (callback) {
    if (config.report.sendMails != 'true') {
        return callback('Reports are disabled and will not be sent. Set REPORT_SEND = \'true\'');
    }


    async.waterfall([
        // Read messages
        function (next) {
            var reportStartDate = moment().startOf('day');
            if (config.report.reportDays * 1 > 1) {
                reportStartDate = reportStartDate.subtract(config.report.reportDays * 1, 'days');
            }
            var reportEndDate = moment();
            Notification.find({
                isConfirmed: true,
                isSent: true,
                sendingStarted: {'$gte': reportStartDate, '$lte': reportEndDate}
            }, next);
        },
        // Read template
        function (notificationArray, next) {

            fs.readFile(path.join(__dirname, '../../templates', 'report.txt'), 'utf8', function (err, templateString) {
                if (err) {
                    console.error('Cannot read report template', err);
                    return next(err);
                }
                next(null, notificationArray, templateString);
            });
        },
//        calculate and replace variables
        function (notificationArray, templateString, next) {

            if (!notificationArray || notificationArray.length && notificationArray.length == 0) {
                return next('No entries for report');
            }

            if (!templateString) {
                return next('No template for report');
            }

            var counter = {
                sms: 0,
                email: 0,
                all: 0
            };

            var messages = [];

            var singleNotificationTemplate = '${ nr }. ${ notificationType }: ${ recipient } ${ summary } || Status (${ status }) | confirmed (${ confirmed })';
            var singleNotification = _.template(singleNotificationTemplate);

            _.forEach(notificationArray, function (n) {
                counter.all++;
                if (n.notificationType.indexOf('sms') != -1) {
                    counter.sms++;
                    messages.push(singleNotification({
                        nr: counter.all,
                        notificationType: 'SMS',
                        recipient: n.recipient.name,
                        summary: n.message,
                        status: n.status,
                        confirmed: n.isConfirmed
                    }));
                }

                if (n.notificationType.indexOf('email') != -1) {
                    counter.email++;
                    messages.push(singleNotification({
                        nr: counter.all,
                        notificationType: 'E-Mail',
                        recipient: n.recipient.name,
                        summary: n.subject,
                        status: n.status,
                        confirmed: n.isConfirmed
                    }));
                }
            });

            var compiled = _.template(templateString);
            var msg = compiled({
                datum: moment().format("dddd, MMMM Do YYY"),
                sentCount: counter.all,
                smsSentCount: counter.sms,
                emailSentCount: counter.email,
                notificationList: messages.join('\n')
            });

            next(null, msg);
        },

        function (msg, next) {
            var emailRq = {
                email: config.report.reportRecipient,
                subject: 'J316 Report',
                message: msg,
                tag: 'Report'
            };

            PostmarkWorker.sendEmail(emailRq, function (err, result) {
                if (err) {
                    console.error('Cannot send report', err);
                    return next(err);
                }

                next(null, {
                    status: 'ok',
                    result: result
                });
            });
        }

    ], function (err, msg) {
        if (err) {
            console.error('Failure by report processing', err);
            return callback(err);
        }
        console.info('Report created and sent successfull');
        return callback(null, msg);
    });


};


/**
 * Returns the list with scheduling of not sent notifications
 * @param callback
 */
InfoOffice.prototype.getNextNotifications = function (rqData, callback) {
    var rqData = _.assign(rqData, {isSent: false});
    Notification.find(rqData, function (err, data) {
        if (err) {
            return callback(err);
        }
        var infoArray = [];
        _.forEach(data, function (notification) {
            infoArray.push({
                notification: notification,
                in: notification.timeToWait()
            });
        })
        callback(null, infoArray);
    })
};

InfoOffice.prototype.statusUpdateSMS77 = function (msgId, status, callback) {
    if (!msgId) {
        return callback('Cannot update status of msgId null');
    }

    if (!status) {
        return callback('Cannot update status null');
    }

    Notification.findOne({'reciept.messageId': msgId}, function (err, notification) {
        if (err) {
            console.error('Cannot find notification with msg_id ' + msgId);
            return callback(err);
        }

        if (!notification) {
            return callback('No Notification with given id found');
        }

        if (notification.reciept.deliveryStatus) {
            return callback('Notification already confirmed at ' + moment(notification.reciept.timestamp).format());
        }

        notification.confirm({timestamp: new Date().getTime(), deliveryStatus: status}, function (err, result) {
            callback(err, result);
        });
    });
};

module.exports = new InfoOffice();