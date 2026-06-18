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
    // The app router resolves driver NAME SLUGS (e.g. /#/driver/john), not
    // numeric ids — deep-link via data.slug. Notifications we build in
    // onBackgroundMessage carry the data payload directly on
    // event.notification.data; the compat SDK sometimes nests it under
    // data.FCM_MSG.data, so check both.
    const d = event.notification.data || {};
    const slug = d.slug || (d.FCM_MSG && d.FCM_MSG.data && d.FCM_MSG.data.slug) || null;
    const url = slug ? `/#/driver/${slug}` : '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Focus an already-open app window instead of spawning a new one.
            for (const client of clientList) {
                if ('focus' in client) {
                    if (slug && 'navigate' in client) {
                        client.navigate(url).catch(() => {});
                    }
                    return client.focus();
                }
            }
            return clients.openWindow(url);
        })
    );
});
