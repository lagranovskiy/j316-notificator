var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
});

module.exports = mongoose.model('Notification', NotificationSchema);