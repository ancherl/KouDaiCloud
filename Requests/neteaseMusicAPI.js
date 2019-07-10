const baseUrl ="https://v1.itooi.cn/netease";
// https://v1.itooi.cn/netease
// https://api.itooi.cn/music/netease

// hotSongList, MV, album search
function requestSongListorMV(actionPath,successcb, failcb){
  wx.request({
    url: baseUrl +actionPath,
    method: 'GET',
    dataType: 'json',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: (res) => {
      if(res.statusCode==200 && typeof successcb ==='function'){
        successcb(res.data)
      }else {
        console.log('请求异常, 请重试!')
      }
    },
    fail: ()=>{
      failcb()
    }
  })
}

// 歌单获取
function songListDetails(actonPath, pid, successcb, failcb){
  wx.request({
    url: baseUrl+actonPath,
    method: 'GET',
    data: {
      id: pid,
      limit: 50
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    dataType: 'json',
    success: (res) => {
      if (res.statusCode == 200 && typeof successcb === 'function') {
        successcb(res.data)
      } else {
        console.log('请求异常, 请重试!')
      }
    },
    fail: () => {
      failcb()
    }
  })
}

// 歌曲详情 包括歌曲详情, lrc歌词, 音乐播放地址
function musicDetailRequest(actionPath, mid, successcb, failcb){
  wx.request({
    url: baseUrl+actionPath,
    method: 'GET',
    data: {
      id: mid
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    dataType: 'json',
    success: (res)=>{
      if (res.statusCode == 200 && typeof successcb === 'function') {
        successcb(res.data)
      } else {
        console.log('请求异常, 请重试!')
      }
    },
    fail: ()=>{
      failcb();
    }
  })
}

// mv detail mv详情
function mvDetailRequest(actionPath, mv_id, successcb, failcb){
  wx.request({
    url: baseUrl + actionPath,
    method: 'GET',
    data: {
      id: mv_id
    },
    dataType: 'json',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function(res){
      if (res.statusCode == 200 && typeof successcb === 'function') {
        successcb(res.data)
      } else {
        console.log('请求异常, 请重试!')
      }
    },
    fail: function(){
      failcb();
    }
  })
}

module.exports={
  requestSongListorMV: requestSongListorMV,
  songListDetails: songListDetails,
  musicDetailRequest: musicDetailRequest,
  mvDetailRequest: mvDetailRequest
}