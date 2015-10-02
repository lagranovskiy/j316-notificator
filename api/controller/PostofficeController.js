var PostofficeService = require('./../business/PostofficeService');

/**
 * Module to recieve new notification requests
 * @param req
 * @param res
 * @param next
 */
var PostofficeController = function () {

    var controller = {

        addSMSNotification: function (req, res, next) {
            var notificationRq = req.body;

            if(!notificationRq){
                next('Error. Input is empty');
            }

            var response = PostofficeService.addSMSNotification(notificationRq, function (err, result) {
                if (err) {
                    return res.error(err);
                }
                return res.send(response);
            });
        }
    }

    return controller;
}
module.exports = new PostofficeController();