import localforage from 'localforage'

localforage.config({
  name: 'strivo',
  storeName: 'strivo_data'
})

export const getData = async (key) => {
  try {
    return await localforage.getItem(key)
  } catch (e) {
    return null
  }
}

export const setData = async (key, value) => {
  try {
    await localforage.setItem(key, value)
  } catch (e) {
    console.error('Storage error:', e)
  }
}

export const getTodayKey = () => {
  const d = new Date()
  return `day_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`
}

export const getYesterdayKey = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `day_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`
}