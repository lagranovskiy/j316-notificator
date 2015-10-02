var mongoose = require('mongoose'),
    Notification = mongoose.model('Notification');

var
    PostOffice = function () {

        return {

            addSMSNotification: function (smsNotificationData, callback) {

                var notification = new Notification(smsNotificationData);

                var validation = notification.validateSync();
                if(validation){
                    console.log(notification.validateSync().toString());
                }


                notification.save(function (err, notification) {
                    if (err) {
                        console.error('Cannot save notification', e);
                        return callback(err);
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

    };

module.exports = new PostOffice();