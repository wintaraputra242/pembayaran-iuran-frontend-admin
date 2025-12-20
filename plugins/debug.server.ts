export default defineNuxtPlugin(() => {
  Object.prototype.hasOwnProperty = Object.prototype.hasOwnProperty || function () {
    return false
  }
})
