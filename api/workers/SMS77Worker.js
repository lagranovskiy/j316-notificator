var _ = require('lodash');
var requestify = require('requestify');
var config = require('../../config/config');

var SMS77Worker = function () {


    return {

        /**
         * Send email notification
         *
         * @param rqData
         * @param callback
         */
        sendSMS: function (smsRq, callback) {

            // Validate that we have all we need
            if (!smsRq.mobile) {
                return callback('No Mobile- no sms');
            }
            if (!smsRq.message) {
                return callback('No message- no message');
            }

            var notificationAPI = config.notificationAPI;

            requestify.post(notificationAPI.sms77.endpoint, {}, {
                params: {
                    u: notificationAPI.sms77.username,
                    p: notificationAPI.sms77.apiToken,
                    type: notificationAPI.sms77.smsType,
                    from: notificationAPI.sms77.senderSMS,
                    text: smsRq.message,
                    to: smsRq.mobile,
                    return_msg_id: 1,
                    debug: notificationAPI.sms77.debugMode
                }
            }).then(function (response) {

                var data = response.body.split('\n')
                var resultCode = data[0];
                if (response.getCode() == 200 && resultCode === '100') {

                    callback(null, {
                        resultCode: resultCode,
                        messageId: data[1]
                    });

                } else {
                    callback('Error code: ' + response.body);
                }
            });
        }

    };

};

module.exports = new SMS77Worker();