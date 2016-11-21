var mongoose = require('mongoose'),
    _ = require('lodash'),
    Notification = mongoose.model('Notification');

var
    PostOffice = function () {
    };


/**
 * Removes notifications that are not sent already
 *
 * @param rmParams
 * @param callback
 */
PostOffice.prototype.removeNotifications = function (rmParams, callback) {
    /*// Removing of processed entries is not allowed
     rmParams.isSent = false;
     rmParams.isConfirmed = false;
     */
    Notification.remove(rmParams, function (err, notificationList) {
        callback(err, notificationList);
    });
};

/**
 * Returns the list of all notifications
 *
 * @param callback
 */
PostOffice.prototype.getAllNotifications = function (rqParams, callback) {
    Notification.find(rqParams, function (err, notificationList) {
        callback(err, notificationList);
    });
}

/**
 * Schedules a new notification
 *
 * @param smsNotificationData notification data
 * @param callback
 */
PostOffice.prototype.scheduleNotification = function (smsNotificationData, callback) {

    var notification = new Notification(smsNotificationData);

    var validation = notification.validateSync();
    if (validation) {
        var valData = notification.validateSync().toString()
        console.info(valData);
        return callback(valData)
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
};


module.exports = new PostOffice();