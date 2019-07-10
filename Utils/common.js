// 格式化 Number
function formatNumber(value){
  value = value.toString();
  return value.length === 1 ? '0' + value : value
}
// 格式化 playtime 参数， 单位为s
function formatPlaytime(duration){
  return formatNumber(Math.floor(parseFloat(duration) / 60)) + ':' + formatNumber(Math.floor(parseFloat(duration)%60))
}
// 格式化 song duration MM:ss
function formatDuration(duration){
  return (Math.floor(duration * 0.001 / 60).toString().length === 1 ? '0' + Math.floor(duration * 0.001 / 60) : Math.floor(duration * 0.001 / 60)) + ':' + (Math.floor(duration * 0.001 % 60).toString().length === 1 ? '0' + Math.floor(duration * 0.001 % 60) : Math.floor(duration * 0.001 % 60))
}

module.exports={
  formatPlaytime: formatPlaytime,
  formatDuration: formatDuration
}