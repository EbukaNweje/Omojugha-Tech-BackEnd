
const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    pushNotifications: {
        type: Boolean,
        default: true
    }
});

const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema);

module.exports = NotificationSettings;
