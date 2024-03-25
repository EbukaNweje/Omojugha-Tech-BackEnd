
const express = require('express');
const notificationRouter = express.Router();
const updateNotificationSettings = require('../controllers/notificationSettingControllers');

// Route to update notification settings
notificationRouter.put('/notifications/settings/:userId', updateNotificationSettings);

module.exports = notificationRouter;
