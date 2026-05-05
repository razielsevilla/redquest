async function sendQuestPushNotification({ token, title, body, data }) {
  if (!token) {
    console.warn('Skipping quest push notification because no device token was provided.');
    return { skipped: true };
  }

  console.log('Quest push notification', {
    token,
    title,
    body,
    data,
  });

  return { skipped: false };
}

module.exports = {
  sendQuestPushNotification,
};