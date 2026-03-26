// Firebase messaging service worker for push notifications
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDY2OceDzBWMHPR3C3O1oxktrCIy3mKMqU",
    authDomain: "glorybounddispatch.firebaseapp.com",
    projectId: "glorybounddispatch",
    storageBucket: "glorybounddispatch.firebasestorage.app",
    messagingSenderId: "114912216623",
    appId: "1:114912216623:web:a835cd6054d3e1707668da"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || 'Davis Delivery Dispatch';
    const options = {
          body: payload.notification?.body || 'You have a new message',
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          vibrate: [200, 100, 200],
          tag: 'davis-delivery-notification',
          renotify: true,
          data: payload.data
    };
    self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const driverId = event.notification.data?.driverId;
    const url = driverId ? `/#/driver/${driverId}` : '/';
    event.waitUntil(clients.openWindow(url));
});
