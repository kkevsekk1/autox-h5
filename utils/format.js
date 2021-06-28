function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}
export function formatTime (time) {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
export function surplusDays (date) {
  let now = new Date()
  let until = new Date(date)
  let days = (until - now) / 1000 / 3600 / 24 + 1
  let surplusTime = Math.floor(days)
  return surplusTime
}   
export default {
  formatNumber,
  formatTime,
  surplusDays
}
