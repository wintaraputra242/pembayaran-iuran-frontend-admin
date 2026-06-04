importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js')

// firebase.initializeApp({
//   apiKey: self.FIREBASE_API_KEY,
//   authDomain: self.FIREBASE_AUTH_DOMAIN,
//   projectId: self.FIREBASE_PROJECT_ID,
//   storageBucket: self.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID,
//   appId: self.FIREBASE_APP_ID,
// })

firebase.initializeApp({
  apiKey: 'AIzaSyAJ4YmJ_nCaVF0QeTCrKiXdw2aVvOPNeDU',
  authDomain: 'pembayaran-iuran-50e8e.firebaseapp.com',
  projectId: 'pembayaran-iuran-50e8e',
  storageBucket: 'pembayaran-iuran-50e8e.firebasestorage.app',
  messagingSenderId: '511066113017',
  appId: '1:511066113017:web:1d98eef78a9fb60de53328',
  measurementId: "G-K5XH83LZB8"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {}

  self.registration.showNotification(title ?? 'Notifikasi', {
    body,
    icon: '/icons/icon-192x192.png',
  })
})
