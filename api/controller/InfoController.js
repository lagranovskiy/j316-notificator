var InfoService = require('./../business/InfoService');
var _ = require('lodash');
var config = require('../../config/config');

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
var InfoController = function () {

    var controller = {

        /**
         * Process dayly report
         * @param req
         * @param res
         * @param next
         */
        report: function (req, res, next) {
            if (!req.query.apiToken) {
                next('No API_TOKEN sent. Cannot process');
            }
            if (!req.query.apiToken === config.apiToken) {
                next('Token API_TOKEN is invalid. Cannot process');
            }


            InfoService.createReport(function (err, result) {
                if (err) {
                    return next(err);
                }
                return res.send(result);
            });
        },

        getNextNotifications: function (req, res, next) {
            var rq = _.assign(getFilterOptions(req.params), getFilterOptions(req.query));

            InfoService.getNextNotifications(rq, function (err, result) {
                if (err) {
                    return next(err);
                }
                return res.send(result);
            });
        },


        /**
         * Confirms a sent sms
         *
         * @param req
         * @param res
         * @param next
         */
        processSMS77Confirmation: function (req, res, next) {
            var msgId = req.query.msg_id;
            var status = req.query.status;

            InfoService.statusUpdateSMS77(msgId, status, function (err, result) {
                if (err) {
                    console.error('Cannot update sms notification status: ' + err);
                    return next(err);
                }
                res.send({
                    timestamp: new Date().getTime(),
                    msgId: msgId,
                    status: status,
                    result: 'thank you'
                });

            })
        }


    }

    return controller;
}
module.exports = new InfoController();