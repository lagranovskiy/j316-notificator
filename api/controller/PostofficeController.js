var PostofficeService = require('./../business/PostofficeService');
var PostmanService = require('./../business/PostmanService');
var _ = require('lodash');

/**
 * Returns the filtering options
 * prevents duplicate code
 * @param root
 * @returns {{}}
 */
function getFilterOptions(root) {
    var rq = {};
    if (root.email) {
        rq['recipient.email'] = root.email;
    }
    if (root.mobile) {
        rq['recipient.mobile'] = root.mobile;
    }
    if (root.category) {
        rq.category = root.category;
    }
    if (root.referenceId) {
        rq.referenceId = root.referenceId;
    }
    if (root.isSent) {
        rq.isSent = root.isSent;
    }
    if (root.isConfirmed) {
        rq.isConfirmed = root.isConfirmed;
    }
    return rq;
}

/**
 * Module to recieve new notification requests
 * @param req
 * @param res
 * @param next
 */
var PostofficeController = function () {

    var controller = {


        /**
         * Trigger notification process
         *
         * @param req
         * @param res
         * @param next
         */
        notify: function (req, res, next) {
            PostmanService.processNotification(function (err, result) {
                if (err) {
                    return next(err);
                }
                return res.send(result);
            });
        },
        /**
         * Returns the list of notifications
         *
         * @param req
         * @param res
         * @param next
         */
        readNotifications: function (req, res, next) {

            var rq = _.assign(getFilterOptions(req.params), getFilterOptions(req.query));

            PostofficeService.getAllNotifications(rq, function (err, result) {
                if (err) {
                    return next(err);
                }
                return res.send(result);
            });
        },

        /**
         * removes the list of notifications selected by one of the possible categories
         *
         * @param req
         * @param res
         * @param next
         */
        removeIndexedNotifications: function (req, res, next) {

            var rq = getFilterOptions(req.params);

            PostofficeService.removeNotifications(rq, function (err, result) {
                if (err) {
                    return next(err);
                }
                return res.send(result);
            });
        },

        /**
         * Adds a new notification
         *
         * @param req
         * @param res
         * @param next
         */
        scheduleNotification: function (req, res, next) {

            var notificationRq = req.body;

            if (!notificationRq) {
                return next('Error. Input is empty');
            }

            PostofficeService.scheduleNotification(notificationRq, function (err, result) {
                if (err) {
                    return next(err);
                }
                return res.send(result);
            });
        }
    }

    return controller;
}
module.exports = new PostofficeController();