import { getToken } from 'firebase/messaging'

export const useFirebaseMessaging = () => {
  const config = useRuntimeConfig()
  const { $messaging } = useNuxtApp()

  const requestPermissionAndGetToken = async (): Promise<string | null> => {
    if (!('Notification' in window)) {
      console.warn('Browser tidak support notifikasi')
      return null
    }

    if (Notification.permission === 'denied') {
      console.warn('Notifikasi diblokir oleh user')
      return null
    }

    try {
      const permission = await Notification.requestPermission()

      if (permission !== 'granted') return null

      const token = await getToken($messaging, {
        vapidKey: config.public.firebaseVapidKey,
        // serviceWorkerRegistration: await navigator.serviceWorker.getRegistration(),
      })

      return token ?? null
    } catch (error) {
      console.error('FCM error:', error)
      return null
    }
  }

  return { requestPermissionAndGetToken }
}
