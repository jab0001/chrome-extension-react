
export const localStorageSubsribe = (key, callback) => {
  function runCalback() {
    const item = localStorage.getItem(key)

    if (item) {
      callback()
    }
  }

  window.addEventListener('storage', runCalback)

  return () => window.removeEventListener('storage', runCalback)
}