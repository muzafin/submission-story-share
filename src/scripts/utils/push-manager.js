import CONFIG from '../config.js';
import { getToken } from './auth-token.js';

const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

export const isPushSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const subscribePushNotification = async () => {
  if (!isPushSupported()) throw new Error('Push Notification not supported');

  const swRegistration = await navigator.serviceWorker.ready;
  let pushSubscription = await swRegistration.pushManager.getSubscription();

  if (!pushSubscription) {
    pushSubscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(pushSubscription.getKey('p256dh'))));
    const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(pushSubscription.getKey('auth'))));

    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: p256dh,
          auth: auth,
        },
      }),
    });
    
    if(!response.ok) {
        throw new Error('Failed to subscribe push notification to server');
    }
  }

  return pushSubscription;
};

export const unsubscribePushNotification = async () => {
  if (!isPushSupported()) throw new Error('Push Notification not supported');

  const swRegistration = await navigator.serviceWorker.ready;
  const pushSubscription = await swRegistration.pushManager.getSubscription();

  if (pushSubscription) {
    await pushSubscription.unsubscribe();
    
    await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        endpoint: pushSubscription.endpoint,
      }),
    });
  }
};

export const checkIsSubscribed = async () => {
  if (!isPushSupported()) return false;
  const swRegistration = await navigator.serviceWorker.ready;
  const pushSubscription = await swRegistration.pushManager.getSubscription();
  return pushSubscription !== null;
};
