

const NotificationSettings = require('../models/notificationSettingModel');

// Controller function to update notification settings
const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { emailNotifications, pushNotifications } = req.body;

    // Update notification settings in the database
    await NotificationSettings.findOneAndUpdate({ userId }, { emailNotifications, pushNotifications });

    res.status(200).json({ message: 'Notification settings updated successfully' });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = updateNotificationSettings
