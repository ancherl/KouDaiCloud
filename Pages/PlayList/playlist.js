// Pages/PageList/playlist.js
var requests = require("../../Requests/neteaseMusicAPI.js")

let app = getApp();

Page({
  data: {
    list: [],
    curplay: {},
    pid: 0,
    cover: '',
    music: {},
    playing: false,
    playtype: 1,
    playcount: null,
    songListName: null,
    loading: true,
  },
  onLoad: function (options) {
    requests.songListDetails("/songList?pageSize=10",options.pid, (data)=> {
      if (data.data.tracks.length!=0){
        this.setData({
          list: this.data.list.concat(data.data.tracks.slice(0,30)),
          cover: data.data.coverImgUrl,
          playcount: data.data.playCount,
          songListName: data.data.name,
        })
      }else{
        this.setData({
          list: []
        })
      }

  },()=>{
    console.log('请求异常，请重试!')
    });
  },
  onReady: function () {

  },
  onShow: function () {
    this.setData({
      curplay: app.globalData.curplay,
      music: app.globalData.curplay,
      playing: app.globalData.playing,
      playtype: app.globalData.playtype
    })
  },
  onHide: function () {

  },
  onPullDownRefresh: function () {
    
  },
  playall: function(){
    this.setplayist(this.data.list[0],0);
    app.seekmusic(1)
  },
  setplayist: function(music, index){
      //设置播放列表，设置当前播放音乐，设置当前音乐在列表中位置
    app.globalData.list_am = music;
    app.globalData.list_sf = music;
    app.globalData.curplay.st = app.globalData.staredlist.indexOf(app.globalData.curplay.id) < 0 ? false : true;
      app.globalData.index_am = index;
      app.globalData.playtype=1;
      var shuffle=app.globalData.shuffle;
      app.shuffleplay(shuffle);
      app.globalData.globalStop = false;
  },
  playmusic: function(e){
    let index = e.currentTarget.dataset.index;
    app.globalData.list_am = [];   /* 清空数组 */
    app.globalData.list_sf = []; /* 清空数组 */
    this.setplayist(this.data.list, index)
  }
})