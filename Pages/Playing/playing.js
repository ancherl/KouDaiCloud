// Pages/Playing/playing.js
var requests = require("../../Requests/neteaseMusicAPI.js")
var common = require("../../Utils/common.js")
const baseUrl = "https://v1.itooi.cn/netease";
let app = getApp();

Page({
  data: {
    playing: false,
    music: {},
    currentUrl: null,
    playtime: '00:00',
    duration: '00:00',
    percent: 0,
    lrc: [],
    commentscount: 0,
    lrc_index: [],
    showlrc: false,
    toView: 'lrcindex-0',  //实现歌词动态滚动
    lrctime: 0,
    playlist: [],
    curpl: [],  //播放列表
    share: {
      title: "",
      des: ""
    },
    showminfo: false, //是否显示音乐信息
    showpinfo: false,  //是否显示播放列表
    showainfo: false,   //是否显示专辑信息

  },
  onLoad: function (options) {
    var that=this;
    this.setData({
      curpl: app.globalData.list_am,
      shuffle: app.globalData.shuffle,
      playing: app.globalData.playing ==false ? false : true,
      windowHeight: wx.getSystemInfoSync().windowHeight
    });
    // 判断是否有歌曲正在播放， 如不是，则播放新的歌曲
    if (app.globalData.curplay.id != options.id || !app.globalData.curplay.url){
      app.playmusic(that, options.id, options.bar);//第一次播放音乐或者播放新音乐
    }else{
      this.setData({
        start: 0,
        music: app.globalData.curplay,
        sliderMaxValue: app.globalData.curplay.dt * 0.001,
        duration: common.formatDuration(app.globalData.curplay.dt),
        lrc: app.globalData.lrc,
        lrc_index: app.globalData.lrc_index,
        share: {
          id: app.globalData.curplay.id,
          br: options.bar,
          title: app.globalData.curplay.name,
          des: app.globalData.curplay.al.name,
          url: app.globalData.curplay.al.picUrl
        }
      });
      wx.setNavigationBarTitle({
        title: app.globalData.curplay.name,
      });
      app.globalData.backgroundAudioManager.onTimeUpdate(function () {
        if (that.data.lrc_index.length != 0) {
          that.setData({
            playtime: common.formatPlaytime(app.globalData.backgroundAudioManager.currentTime),
            percent: app.globalData.backgroundAudioManager.currentTime,
            toView: that.data.lrc_index.indexOf('lrcindex-' + Math.floor(app.globalData.backgroundAudioManager.currentTime)) === -1 ? that.data.toView : 'lrcindex-' + Math.floor(app.globalData.backgroundAudioManager.currentTime),  //实现歌词动态滚动
          })
        } else {
          that.setData({
            playtime: common.formatPlaytime(app.globalData.backgroundAudioManager.currentTime),
            percent: app.globalData.backgroundAudioManager.currentTime
          })
        }

      });
    }
  },

  onShow: function () {

  },
  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function (res) {
    return {
      title: this.data.share.title,
      path: '/Pages/Playing/playing?share=1&st=playing&id='+this.data.share.id,
      imageUrl: this.data.share.url
    }
  },
  // 播放歌曲 br 表示码率: 128000 192000 320000 999000

  // 暂停 或 继续播放
  playingtoggle: function(){
    app.togglePlay(this, app, function(){})
  },
  // 加载歌词
  loadlrc: function(){
    app.loadlrc(this);
  },
  // 播放下一首 或 前一首song
  playother: function(e){
    var type = e.currentTarget.dataset.other;
    var that =this;
    app.nextplay(that, type, function(){
      app.playmusic(that, app.globalData.curplay.id);
      that.setData({
        showlrc: false,
        lrc: [],
        share: {
          id: app.globalData.curplay.id,
          title: app.globalData.curplay.name,
          // des: app.globalData.curplay.artists[0].name
        }
      });
      
    })
  },
// 拉动滑块定点播放
museek: function(e){
  var that = this;
  app.seekmusic(that, 1, e.detail.value, function(){
    that.setData({
      percent: e.detail.value
    })
  });
},
//切换播放方式
playshuffle: function(){

},
// 打开播放列表
togpinfo: function(){
  this.setData({
    showminfo: false,
    showainfo: false,
    showpinfo: !this.data.showpinfo
  })
},
// 打开音乐详情信息
togminfo: function(){
  this.setData({
    showainfo: false,
    showpinfo: false,
    showminfo: !this.data.showminfo
  })
},

pospl: function(e){
  var that =this;
  var index = e.currentTarget.dataset.index;
  app.nextplay(that,1, ()=>{
    app.playmusic(that, app.globalData.curplay.id);
    // 清空歌词信息
    that.setData({
      showlrc: false,
      lrc: []
    });
  }, index);
},
del_curpl: function(e){
  var index = e.currentTarget.dataset.index;
  app.globalData.list_sf.splice(index, 1);
  app.globalData.list_am=app.globalData.list_sf;
  app.globalData.index_am = app.globalData.index_am > index ? app.globalData.index_am-1 : app.globalData.index_am;
  this.setData({
    curpl: app.globalData.list_am
  })
}

})