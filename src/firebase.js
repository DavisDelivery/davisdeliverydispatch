import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, onSnapshot, query, orderBy, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDY2OceDzBWMHPR3C3O1oxktrCIy3mKMqU",
    authDomain: "glorybounddispatch.firebaseapp.com",
    projectId: "glorybounddispatch",
    storageBucket: "glorybounddispatch.firebasestorage.app",
    messagingSenderId: "114912216623",
    appId: "1:114912216623:web:a835cd6054d3e1707668da"
};

const VAPID_KEY = "BIThI3aLcKZaZWdDtDKif5idE6wBYKQ79nNlItcjpWxz_aOuOAXvqUcSDeVLTkcG-IZ2cXxyGVbR0IyOMGewUiU";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getWeekKey(weekOffset = 0) {
    const now = new Date();
    const d = now.getDay();
    const mon = new Date(now);
    mon.setDate(now.getDate() - (d === 0 ? 6 : d - 1) + weekOffset * 7);
    const year = mon.getFullYear();
    const janFirst = new Date(year, 0, 1);
    const weekNum = Math.ceil(((mon - janFirst) / 86400000 + janFirst.getDay() + 1) / 7);
    return `${year}-W${String(weekNum).padStart(2, '0')}`;
}

function getDayKey(weekOffset, dayIndex) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return `${getWeekKey(weekOffset)}-${days[dayIndex]}`;
}

const manifestsCol = () => collection(db, 'manifests');

export async function saveManifestDay(weekOffset, dayIndex, entries) {
    const dayKey = getDayKey(weekOffset, dayIndex);
    const docRef = doc(db, 'manifests', dayKey);
    await setDoc(docRef, {
          dayKey, weekOffset, dayIndex,
          entries: JSON.parse(JSON.stringify(entries)),
          updatedAt: new Date().toISOString()
    });
}

export function subscribeManifests(weekOffset, callback) {
    const weekKey = getWeekKey(weekOffset);
    const q = query(manifestsCol());
    return onSnapshot(q, (snapshot) => {
          const data = {};
          snapshot.forEach((d) => {
                  const v = d.data();
                  if (v.dayKey && v.dayKey.startsWith(weekKey)) data[v.dayKey] = v.entries || [];
          });
          callback(data);
    });
}

const driversCol = () => collection(db, 'drivers');

export async function saveDrivers(drivers) {
    for (const drv of drivers) {
          await setDoc(doc(db, 'drivers', String(drv.id)), drv);
    }
}

export function subscribeDrivers(callback) {
    return onSnapshot(driversCol(), (snapshot) => {
          const drivers = [];
          snapshot.forEach((d) => drivers.push(d.data()));
          drivers.sort((a, b) => a.id - b.id);
          if (drivers.length > 0) callback(drivers);
    });
}

const notifsCol = () => collection(db, 'notifications');

export async function sendNotificationToDriver(driverId, message, type) {
    const id = Date.now().toString();
    await setDoc(doc(db, 'notifications', id), {
          driverId, message, type,
          time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          timestamp: new Date().toISOString(),
          read: false, id
    });
}

export function subscribeNotifications(driverId, callback) {
    return onSnapshot(notifsCol(), (snapshot) => {
          const notifs = [];
          snapshot.forEach((d) => {
                  const v = d.data();
                  if (v.driverId === driverId) notifs.push(v);
          });
          notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          callback(notifs);
    });
}

export async function markNotificationRead(notifId) {
    await updateDoc(doc(db, 'notifications', notifId), { read: true });
}

export async function saveEmserHours(dayKey, hours) {
    await setDoc(doc(db, 'emserHours', dayKey), { dayKey, hours, updatedAt: new Date().toISOString() });
}

export function subscribeEmserHours(callback) {
    return onSnapshot(collection(db, 'emserHours'), (snapshot) => {
          const data = {};
          snapshot.forEach((d) => { const v = d.data(); data[v.dayKey] = v.hours; });
          callback(data);
    });
}

let messaging = null;

export async function requestPushPermission() {
    try {
          messaging = getMessaging(app);
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') return null;
          const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
          return token;
    } catch (err) {
          console.error('Push permission error:', err);
          return null;
    }
}

export function onPushMessage(callback) {
    if (!messaging) messaging = getMessaging(app);
    return onMessage(messaging, (payload) => { callback(payload); });
}

export async function saveDriverToken(driverId, token) {
    await setDoc(doc(db, 'fcmTokens', String(driverId)), {
          driverId, token, updatedAt: new Date().toISOString()
    });
}

export { db, getDayKey, getWeekKey };
