// Import Firebase scripts kupitia CDN kwenye Service Worker
importScripts('https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js');

// Weka usanidi wako wa Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAgeqoCTtJCb2iGMqZuHomTEQ0Gz7QvPro",
  authDomain: "dalali-fast.firebaseapp.com",
  projectId: "dalali-fast",
  storageBucket: "dalali-fast.firebasestorage.app",
  messagingSenderId: "43277398471",
  appId: "1:43277398471:web:9ffa15a498b2c3c70ae9e2",
  measurementId: "G-KETQHWYENB"
});

const messaging = firebase.messaging();

// Hiari: Kushughulikia arifa zinazokuja wakati app iko nyuma ya pazia
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Ujumbe mpya umepokewa nyuma ya pazia: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});