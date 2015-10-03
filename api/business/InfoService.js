var mongoose = require('mongoose'),
    _ = require('lodash'),
    Notification = mongoose.model('Notification');

var
    InfoOffice = function () {

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
            }

        };

    };

module.exports = new InfoOffice();