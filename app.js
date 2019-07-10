const baseUrl = "https://v1.itooi.cn/netease";
// https://v1.itooi.cn/netease
// https://api.bzqll.com/music/netease
var requests = require("./Requests/neteaseMusicAPI.js");
var common = require("Utils/common.js");


App({
  onLaunch: function(options){
    
  },
  shuffleplay: function (shuffle) {
    //播放模式shuffle，1顺序，2单曲，3随机
    var that = this;
    that.globalData.shuffle = shuffle;
    if (shuffle == 1) {
      that.globalData.list_am = that.globalData.list_sf;
    }
    else if (shuffle == 2) {
      that.globalData.list_am = [that.globalData.curplay]
    }
    else {
      that.globalData.list_am = [].concat(that.globalData.list_sf);
      var sort = that.globalData.list_am;
      sort.sort(function () {
        return Math.random() - (0.5) ? 1 : -1;
      })

    }
    for (let s in that.globalData.list_am) {
      if (that.globalData.list_am[s].id == that.globalData.curplay.id) {
        that.globalData.index_am = s;
      }
    }
  },
  // 歌曲定位播放， seek 代表音乐位置， 单位s
  seekmusic: function (that, type, seek, cb) {
    var _this = this;
    var m = _this.globalData.curplay;
    if (!m.id) return;
    _this.globalData.playtype = type;
    if (cb) {
      _this.playing(that,type, cb, seek);
    } else {
      this.geturl(function () { _this.playing(that, type, cb, seek); })
    }
  },
  // 获取音乐播放地址
  geturl: function (suc, err, cb) {
    var m = this.globalData.curplay;

    if(!m.url){
      err && err()
    }else{
      this.globalData.curplay.getutime=(new Date()).getTime();
      if (this.globalData.staredlist.indexOf(this.globalData.curplay.id)!=-1)      {
            this.globalData.curplay.starred = true;
            this.globalData.curplay.st = true;
      };
      suc && suc();
    }
  },
  // 播放音乐
  playing: function (that, type, cb, seek) {
    var _this = this;
    var m = _this.globalData.curplay;
    const bgAudioManager=_this.globalData.backgroundAudioManager;
    bgAudioManager.src = m.url;
    bgAudioManager.title = m.name;
    bgAudioManager.singer = m.ar[0].name;
    bgAudioManager.coverImgUrl = m.al.picUrl;
    bgAudioManager.duration = Math.floor(m.dt * 0.001);
   
    if (seek != undefined) {
        bgAudioManager.startTime = seek;
        bgAudioManager.seek(seek);  
    }else{
      bgAudioManager.startTime = 0;
    }
    bgAudioManager.play();
    cb && cb();

    // listen Play event
    bgAudioManager.onPlay(function () {
      _this.globalData.globalStop = false;
      _this.globalData.playtype = type;
      _this.globalData.playing = true;
    });
    bgAudioManager.onPause(function () {
      _this.globalData.globalStop = true;
      _this.globalData.playtype = type;
      _this.globalData.playing = false;
    });
    // 歌曲播放结束后自动播放下一首
    bgAudioManager.onEnded(function () {
      _this.nextplay(that, type, function () {
        _this.playmusic(that, _this.globalData.curplay.id);
        that.setData({
          lrc: [],
          share: {
            id: _this.globalData.curplay.id,
            title: _this.globalData.curplay.name,
            // des: app.globalData.curplay.artists[0].name
          }
        });
        // 重新加载歌词
        this.loadlrc(that);
      })
    });
   
    // listen Error event
    bgAudioManager.onError(function (err) {
      console.log(err);
      if (type !== 2) {
        // that.nextplay(1)
      } else {
        // that.nextfm();
      }
    });
    // backgroundAudioManager Update listen
    bgAudioManager.onTimeUpdate(function () {
      if (that.data.lrc_index.length != 0) {
        that.setData({
          playtime: common.formatPlaytime(bgAudioManager.currentTime),
          percent: bgAudioManager.currentTime,
          toView: that.data.lrc_index.indexOf('lrcindex-' + Math.floor(bgAudioManager.currentTime)) === -1 ? that.data.toView : 'lrcindex-' + Math.floor(bgAudioManager.currentTime),  //实现歌词动态滚动
        })
      } else {
        that.setData({
          playtime: common.formatPlaytime(bgAudioManager.currentTime),
          percent: bgAudioManager.currentTime
        })
      }

    })
    
  },
  // 播放音乐
  playmusic: function (that, id, br) {
    // 获取歌曲播放URL
    requests.musicDetailRequest("/url?quality=flac&isRedirect=0", id, (data) => {
      if (data.data) {
        that.setData({
          currentUrl: data.data.replace(" ", "")
        })
      } else {
        console.log('歌曲URl获取失败!');
      }
    }, () => {
      console.log("请求异常, 请重试!")
    });
    // 获取歌曲详情
    requests.musicDetailRequest("/song", id, (data) => {
      if (data.data.songs.length != 0) {
        this.globalData.curplay = data.data.songs[0];

        this.globalData.curplay.url = that.data.currentUrl;
        that.setData({
          start: 0,
          share: {
            id: this.globalData.curplay.id,
            br: br,
            title: this.globalData.curplay.name,
            des: this.globalData.curplay.al.name,
            url: this.globalData.curplay.al.picUrl
          },
          music: this.globalData.curplay,
          duration: common.formatDuration(this.globalData.curplay.dt),
          playing: true
        });
        wx.setNavigationBarTitle({
          title: this.globalData.curplay.name,
        });
        this.seekmusic(that,1);
      }
    }, () => {
      console.log("请求异常, 请重试!")
    })
  },
  //  暂停播放 或 继续播放
  togglePlay: function(that, app, cb){
    if(that.data.playing){
      that.setData({
        playing: false
      });
      this.globalData.backgroundAudioManager.pause()
    }else{
      that.setData({
        playing: true
      });
      this.globalData.backgroundAudioManager.play()
    }
  },
  loadlrc: function(that){
    if (that.data.showlrc){
      that.setData({
        showlrc: false
      })
    }else{
      that.setData({
        showlrc: true
      })
    };
    if(that.data.lrc.length===0){
      var lrcid = that.data.music.id;
      wx.request({
        url: baseUrl + '/lrc?id=' + lrcid,
        method: 'GET',
        dataType: 'json',
        success: (res) => {
          var lrc = this.parse_lrc(res.data);
          res.lrc=lrc.now_lrc;
          res.scroll=lrc.scroll ? 1 : 0;
          that.setData({
            lrc: res,
            lrc_index: lrc.lrc_index
          });
          this.globalData.lrc_index = lrc.lrc_index;
          this.globalData.lrc = res;
        },
        fail: () => {
          console.log('请求异常, 请重试!')
        }
      })
    }
  },
  // 解析lrc字符串 字符串 -> 数组
  parse_lrc: function(lrc_content){
    let now_lrc=[];
    let lrc_index=[];
    let lrc_row = lrc_content.split('\n');
    let scroll = true;
    
    for(let i in lrc_row){
      if(lrc_row[i].indexOf(']')===-1 && lrc_row[i]){
        now_lrc.push({lrc: lrc_row[i]})
      }else if(lrc_row[i]!==''){
        scroll=false;
        var temp = lrc_row[i].split(']');
        for(let j in temp){
          let temp2 = temp[j].substr(1, 5);
          temp2 = temp2.split(':');
          let lrc_sec = parseInt(temp2[0]) * 60 + parseInt(temp2[1]);
          if(lrc_sec >= 0){
            let lrc = temp[temp.length-1].replace(/(^\s*)|(\s*$)/g, '');
            lrc && now_lrc.push({lrc_sec: lrc_sec, lrc: lrc}) && lrc_index.push('lrcindex-'+lrc_sec);
          }
        }
      }
    }
    if(!scroll){
      now_lrc.sort(function(a, b){
        return a.lrc_sec - b.lrc_sec
      })
    }
    return {
      now_lrc: now_lrc,
      scroll: scroll,
      lrc_index: lrc_index
    }
  },
  nextplay: function(that, type, cb, pos){
    this.preplay(that);
    // FM播放
    if(this.globalData.playtype==2){
      return;
    }
    var list = this.globalData.playtype==1 ? this.globalData.list_am : this.globalData.list_dj;
    var index = this.globalData.playtype==1 ? this.globalData.index_am : this.globalData.index_dj;
    if(type==1){
      index++
    }else{
      index--;
    }
    // 判断当前的index 是否超出当前 list 的索引范围
    index = index > (list.length-1) ? 0 : (index < 0 ? list.length-1 : index);
    index = pos!=undefined ? pos : index;

    this.globalData.curplay = this.globalData.playtype == 1 ? list[index] : this.globalData.curplay;
    if (this.globalData.staredlist.indexOf(this.globalData.curplay.id) != -1) {
      this.globalData.curplay.starred = true;
      this.globalData.curplay.st = true;
    }

    if(this.globalData.playtype==1){
      this.globalData.index_am = index
    }else{
      this.globalData.index_dj = index;
    }

    cb & cb();

  },
  // 歌曲切换过程 先暂停正在播放的音乐
  preplay: function(that){
    this.globalData.playing=false;
    this.globalData.globalStop=false;
    this.globalData.backgroundAudioManager.pause();
    that.setData({
      playing: false
    })
  },

  globalData:{
    hide: false,
    list_am: [],
    list_dj: [],
    list_fm: [],
    list_sf: [],
    index_dj: 0,
    index_fm: 0,
    index_am: 0,
    playing: false,
    playtype: 1,
    curplay: {},
    shuffle: 1,
    globalStop: true,
    currentPosition: 0,
    staredlist: [],
    cookie: "",
    user: {},
    backgroundAudioManager: wx.getBackgroundAudioManager(),
    lrc_index:[],
    lrc:[]
  }
})