export default defineNitroPlugin((nitroApp: any) => {
  nitroApp.hooks.hook('render:response', (response: any) => {
    response.body = response.body.replaceAll('/.nuxt/\0', '/.nuxt/')
  })
})
