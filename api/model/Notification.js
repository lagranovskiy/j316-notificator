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
    isSent: {
        type: Boolean,
        default: false
    },
    isConfirmed: {
        type: Boolean,
        default: false
    }
}, { collection: 'notification' });


NotificationSchema.path('notificationType').validate(function (value, done) {
    var ok = value.indexOf('sms') == -1 || value.indexOf('sms') > -1 && !_.isUndefined(this.recipient.mobile);
    done(ok);
}, 'Mobile phone is mandatory by sms notification.');

NotificationSchema.path('notificationType').validate(function (value, done) {
    var ok = value.indexOf('email') == -1 ||  value.indexOf('email') > -1 && !_.isUndefined(this.recipient.email);
    done(ok);
}, 'Email is mandatory by Email notification');

NotificationSchema.path('scheduledDate').validate(function (value, done) {
    var ok = moment(this.scheduledDate).isAfter(new Date());
    done(ok);
}, 'Scheduling must be in future and not in past.');

/**
 * Calculates time untill the notification is going to be fired
 * @returns {*}
 */
NotificationSchema.methods.timeToWait = function(){
    return moment(this.scheduledDate).fromNow();
};

/**
 * Returns notifications that need to be processed
 * @param callback
 */
NotificationSchema.static.getDueNotifications = function(callback){
   this.find({scheduledDate: {"$gte":new Date()},isSent:false, isConfirmed:false}, function(err, data){
       callback(err, data);
   })
};

module.exports = mongoose.model('Notification', NotificationSchema);