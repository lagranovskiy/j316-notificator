var mongoose = require('mongoose'),
    _ = require('lodash'),
    Notification = mongoose.model('Notification');

var
    PostmanOffice = function () {

        return {

            /**
             * Service processes notification if any are to be done
             */
            processNotification: function(callback){

                Notification.get

            }

        };

    };

module.exports = new PostmanOffice();