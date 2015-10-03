var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment'),
    _ = require('lodash');

var NotificationSchema = new Schema({
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    subject:{
        type: String
    },
    message: {
        type: String,
        trim: true,
        required: true
    },
    recipient: {
        name: {
            type: String,
            required: true
        },
        mobile: {
            type: String
        },
        email: {
            type: String
        }
    },
    notificationType: [{
        type: String
    }],
    referenceId: {
        type: String
    },
    category: [{
        type: String,
        required: true
    }],
    sendingStarted: {
        type: Date
    },
    confirmedAt: {
        type: Date
    },
    status: {
        type: String,
        default: 'waiting'
    },
    isSent: {
        type: Boolean,
        default: false
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    reciept:{
        type: Schema.Types.Mixed
    }
}, {collection: 'notification'});


NotificationSchema.path('notificationType').validate(function (value, done) {
    var ok = value.indexOf('sms') == -1 || value.indexOf('sms') > -1 && !_.isUndefined(this.recipient.mobile);
    done(ok);
}, 'Mobile phone is mandatory by sms notification.');

NotificationSchema.path('notificationType').validate(function (value, done) {
    var ok = value.indexOf('email') == -1 || value.indexOf('email') > -1 && !_.isUndefined(this.recipient.email);
    done(ok);
}, 'Email is mandatory by Email notification');

NotificationSchema.path('notificationType').validate(function (value, done) {
    var ok = value.indexOf('email') == -1 || value.indexOf('email') > -1 && !_.isUndefined(this.subject);
    done(ok);
}, 'Email Subject is mandatory by Email notification');

NotificationSchema.path('scheduledDate').validate(function (value, done) {
    var ok = moment(this.scheduledDate).isAfter(new Date());
    done(ok);
}, 'Scheduling must be in future and not in past.');

/**
 * Calculates time untill the notification is going to be fired
 * @returns {*}
 */
NotificationSchema.methods.timeToWait = function () {
    return moment(this.scheduledDate).fromNow();
};


/**
 * Mark Notification as in progress
 */
NotificationSchema.methods.startProcess = function (callback) {
    this.sendingStarted = new Date();
    this.status = 'sending in progress';
    this.save(callback);
};

/**
 * Mark Notification as completed
 */
NotificationSchema.methods.completeProcess = function (status, callback) {
    this.status = status;
    this.isSent = true;
    this.save(callback);
};

/**
 * Mark Notification as confirmed
 */
NotificationSchema.methods.confirmReciept = function (reciept ,callback) {
    this.confirmedAt = new Date();
    this.isConfirmed = true;
    this.reciept = reciept;
    this.save(callback);
};

/**
 * Returns notifications that need to be processed
 * @param callback
 */
NotificationSchema.static ('getDueNotifications',function (callback) {
    this.find({
        scheduledDate: {"$gte": new Date()},
        isSent: false,
        isConfirmed: false,
        sendingStarted: null
    }, function (err, data) {
        callback(err, data);
    })
});

module.exports = mongoose.model('Notification', NotificationSchema);