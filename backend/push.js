const admin = require('firebase-admin');

let firebaseApp = null;

function getFirebaseCredentials() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    try {
      return JSON.parse(serviceAccountJson);
    } catch (error) {
      console.warn('Invalid FIREBASE_SERVICE_ACCOUNT_JSON; falling back to no-op push delivery.');
      return null;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

function getFirebaseApp() {
  if (firebaseApp) {
    return firebaseApp;
  }

  const credentials = getFirebaseCredentials();
  if (!credentials) {
    return null;
  }

  firebaseApp = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(credentials),
      });

  return firebaseApp;
}

async function sendQuestPushNotification({ token, title, body, data }) {
  if (!token) {
    console.warn('Skipping quest push notification because no device token was provided.');
    return { skipped: true, reason: 'missing_token' };
  }

  const app = getFirebaseApp();
  if (!app) {
    console.log('Quest push notification (no Firebase config)', {
      token,
      title,
      body,
      data,
    });
    return { skipped: true, reason: 'missing_firebase_config' };
  }

  const message = {
    token,
    notification: {
      title,
      body,
    },
    data: Object.fromEntries(
      Object.entries(data || {}).map(([key, value]) => [key, String(value)])
    ),
    android: {
      priority: 'high',
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
  };

  try {
    const response = await app.messaging().send(message);
    return { skipped: false, messageId: response };
  } catch (error) {
    console.error('Quest push notification failed; continuing without blocking request flow.', error);
    return { skipped: true, reason: 'send_failed' };
  }
}

module.exports = {
  sendQuestPushNotification,
};