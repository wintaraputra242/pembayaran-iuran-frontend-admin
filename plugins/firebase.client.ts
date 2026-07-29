import { initializeApp } from 'firebase/app'
import { getMessaging, onMessage } from 'firebase/messaging'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseApp = initializeApp({
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.measurementId
  })

  const messaging = getMessaging(firebaseApp)

  onMessage(messaging, (payload) => {
    console.log('Foreground message:', payload)

    if (Notification.permission === 'granted') {
      new Notification(payload.notification?.title ?? 'Notifikasi', {
        body: payload.notification?.body,
        icon: '/icons/icon-192x192.png',
      })
    }
  })

  return {
    provide: {
      firebaseApp,
      messaging,
    },
  }
})
