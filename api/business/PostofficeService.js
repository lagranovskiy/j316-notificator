var mongoose = require('mongoose'),
    _ = require('lodash'),
    Notification = mongoose.model('Notification');

var
    PostOffice = function () {

        return {

            /**
             * Returns the list with scheduling of not sent notifications
             * @param callback
             */
            getNextNotifications: function (rqData, callback) {
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
            },

            /**
             * Removes notifications that are not sent already
             *
             * @param rmParams
             * @param callback
             */
            removeNotifications: function (rmParams, callback) {
                // Removing of processed entries is not allowed
                rmParams.isSent = false;
                rmParams.isConfirmed = false;

                Notification.remove(rmParams, function (err, notificationList) {
                    callback(err, notificationList);
                });
            },

            /**
             * Returns the list of all notifications
             *
             * @param callback
             */
            getAllNotifications: function (rqParams, callback) {
                Notification.find(rqParams, function (err, notificationList) {
                    callback(err, notificationList);
                });
            },

            /**
             * Schedules a new notification
             *
             * @param smsNotificationData notification data
             * @param callback
             */
            scheduleNotification: function (smsNotificationData, callback) {

                var notification = new Notification(smsNotificationData);

                var validation = notification.validateSync();
                if (validation) {
                    console.info(notification.validateSync().toString());
                } else {
                    console.info('Notification ok.');


                    notification.save(function (err, notification) {
                        if (err) {
                            console.error('Cannot save notification', err);
                            return callback(err.toString());
                        }

                        return callback(null,
                            {
                                timestamp: new Date().getTime(),
                                result: 'ok',
                                data: notification._id
                            }
                        );
                    });

                }
            }

        };

    };

module.exports = new PostOffice();