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
    subject: {
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
    eventData: {
        location: {
            type: String,
            required: false
        },
        eventStart: {
            type: Date,
            required: true
        },
        eventEnd: {
            type: Date,
            required: true
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
    reciept: {
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
    if (this.isNew) {
        var ok = moment(this.scheduledDate).isAfter(new Date());
        done(ok);
    } else {
        done(true);
    }

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
NotificationSchema.methods.failed = function (err, callback) {
    this.sendingStarted = null;
    this.status = 'sending failed.. retry';
    this.save(callback);
};


/**
 * Mark Notification as in progress
 */
NotificationSchema.methods.startProcess = function (callback) {
    if (!callback) {
        console.error('No Callback.. undefined output!!');
        return
    }
    this.sendingStarted = new Date();
    this.status = 'sending in progress';
    this.save(callback);
};

/**
 * Mark Notification as completed
 */
NotificationSchema.methods.completeProcess = function (status, callback) {
    if (!callback) {
        console.error('No Callback.. undefined output!!');
        return
    }
    this.status = status;
    this.isSent = true;
    this.save(callback);
};

/**
 * Adds a recipe of sending
 */
NotificationSchema.methods.recipe = function (reciept, callback) {
    if (!callback) {
        console.error('No Callback.. undefined output!!');
        return
    }
    this.reciept = reciept;
    this.save(callback);
};

/**
 * Adds confirmation info
 */
NotificationSchema.methods.confirm = function (confirmationData, callback) {
    if (!callback) {
        console.error('No Callback.. undefined output!!');
        return
    }

    this.confirmedAt = new Date();
    this.status = 'notification confirmed';
    this.isConfirmed = true;
    this.reciept = _.assign(confirmationData, this.reciept);
    this.save(callback);
};


/**
 * Returns notifications that need to be processed
 * @param callback
 */
NotificationSchema.static('getDueNotifications', function (callback) {
    this.find({
        scheduledDate: {"$lte": new Date()},
        isSent: false,
        isConfirmed: false,
        sendingStarted: null
    }, function (err, data) {
        callback(err, data);
    })
});

module.exports = mongoose.model('Notification', NotificationSchema);