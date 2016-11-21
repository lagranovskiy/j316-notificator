var mongoose = require('mongoose'),
    _ = require('lodash'),
    Notification = mongoose.model('Notification');
var async = require('neo-async');

var GoogleCalWorker = require('../workers/GoogleCalWorker');
var PostmarkWorker = require('../workers/PostmarkWorker');
var SMS77Worker = require('../workers/SMS77Worker');

var PostmanOffice = function () {
};

/**
 * Service processes notification if any are to be done
 */
PostmanOffice.prototype.processNotification = function (callback) {


    async.waterfall([
            function (done) {
                Notification.getDueNotifications(function (err, data) {
                        if (err) {
                            return callback(err);
                        }
                        done(null, data);
                    }
                )
            },
            function (notificationEntries, preparationStepDone) {
                if (notificationEntries.length == 0) {
                    console.info('No scheduled tasks to do.. idle...');
                    return callback(null, {
                        timestamp: new Date().getTime(),
                        startedNotifications: 0,
                        status: 'nothing to do..'
                    });
                }

                var notificationReciept = {
                    sms: 0,
                    email: 0,
                    cal: 0
                };

                var tasks = [];

                async.each(notificationEntries, function (notification, nextNotificationPlease) {
                    async.waterfall([
                        function (next) {
                            notification.startProcess(function (err, notification) {
                                next(err, notification);
                            });
                        },
                        function (startedNotification, next) {
                            if (startedNotification.notificationType.indexOf('sms') != -1) {
                                tasks.push(function (done) {
                                    PostmanOffice.prototype.sendSMS(startedNotification, done);
                                });
                                notificationReciept.sms++;

                            }

                            if (startedNotification.notificationType.indexOf('email') != -1) {
                                tasks.push(function (done) {
                                    PostmanOffice.prototype.sendEmail(startedNotification, done);
                                });
                                notificationReciept.email++;
                            }

                            if (startedNotification.notificationType.indexOf('cal') != -1) {
                                tasks.push(function (done) {
                                    PostmanOffice.prototype.sendCal(startedNotification, done);
                                });
                                notificationReciept.cal++;
                            }

                            next(null);
                        }

                    ], function (err) {
                        if (err) {
                            notification.failed();
                            console.error(err);
                            return nextNotificationPlease(err);
                        }
                        nextNotificationPlease(null);

                    });
                }, function (err) {
                    callback(null, {
                        timestamp: new Date().getTime(),
                        startedNotifications: notificationEntries.length,
                        started: notificationReciept
                    });

                    preparationStepDone(err, tasks);
                });

            },
            function (tasks, done) {
                async.parallel(tasks, function (err, completed) {
                    if (err) {
                        console.error(err);
                        return done(err);
                    }
                    async.each(completed, function (completedNotification, nextConfirmationPlease) {
                        completedNotification.completeProcess('notification processed', function (err, notif) {
                            if (err) {
                                console.error('Notification Confirmation failed ', err);
                                return nextConfirmationPlease(err);
                            }
                            nextConfirmationPlease(null, notif);
                            console.log('Notification Execution completed');
                        });
                    }, function (err) {
                        done(err);
                    });

                });

            }
        ],
        function (err) {
            if (err) {
                console.error(err);
                return
            }
            console.log('All Notification Execution completed');
        }
    )


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
        notification.recipe(result, function (err, recipedNotification) {
            if (err) {
                console.error(err);
                return callback(err);
            }
            callback(null, recipedNotification);
        });
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
        notification.recipe(result, function (err, recipedNotification) {
            if (err) {
                console.error(err);
                return callback(err);
            }
            callback(null, recipedNotification);
        });
    });
};


/**
 * Send Calender Event to the worker and process response
 *
 * @param notification
 * @param callback
 */
PostmanOffice.prototype.sendCal = function (notification, callback) {
    console.info('Sending Calender Entry to ' + notification.recipient.name);

    // Validate that we have all we need
    if (!notification.recipient.email) {
        return callback('No Email- No notification');
    }
    if (!notification.subject) {
        return callback('No event subject- No notification');
    }
    if (!notification.message) {
        return callback('No event  message- No notification');
    }

    var calRq = {
        action: "add",
        calender: notification.subject,
        eventName: notification.message,
        eventDescription: notification.subject,
        startDate: notification.eventData.eventStart,
        endDate: notification.eventData.eventEnd,
        guests: notification.recipient.email,
        reminders: [1, 3],
        location: notification.eventData.location
    };

    console.info(JSON.stringify(calRq));

    GoogleCalWorker.createCalenderEvent(calRq, function (err, result) {
            if (err) {
                console.error(err);
                notification.recipe('error' + err);
                return callback(err);
            }
            console.info('Calender Event was sent successfully: ', notification.recipient.name + ' :: ' + JSON.stringify(result));

            notification.recipe(result, function (err, recipedNotification) {
                if (err) {
                    console.error(err);
                    return callback(err);
                }
                callback(null, recipedNotification);
            });
        }
    )
};


module.exports = new PostmanOffice();