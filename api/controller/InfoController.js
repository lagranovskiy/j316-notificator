var InfoService = require('./../business/InfoService');
var _=require('lodash');

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
        rq.isSent = req.query.isSent;
    }
    if (root.isConfirmed) {
        rq.isConfirmed = req.query.isConfirmed;
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

        getNextNotifications: function (req, res, next) {
            var rq = _.assign(getFilterOptions(req.params), getFilterOptions(req.query));

            InfoService.getNextNotifications(rq, function (err, result) {
                if (err) {
                    return next(err);
                }
                return res.send(result);
            });
        }


    }

    return controller;
}
module.exports = new InfoController();