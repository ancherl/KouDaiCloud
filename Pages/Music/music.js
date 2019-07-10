// Pages/Send/send.js
var requests=require("../../Requests/neteaseMusicAPI.js");
let app = getApp();

Component({
  properties: {

  },
  data: {
    inputInitialValue: '',
    searchKey: null,
    clearIconDisplay: 'none',
    hotSongList: [],
    highQuantityList: [],
    mvList: [],
    albumList: [],
    thisday: (new Date()).getDate(),
    playing: false,
    songId: null
  },
  observers: {

  },
  methods: {
    //search Input event
    searchInputEvent(e){
        this.setData({
          searchKey: e.detail.value,
          clearIconDisplay: e.detail.value=='' ? 'none' : 'block'
        })
    },
    // Click 'x' icon
    clearClickEvent(e){
      this.setData({
        inputInitialValue: '',
        clearIconDisplay: 'none'
      })
    },
    bindchange: function(e){
      
    },
    onReachBottom: function(){
      wx.showToast({
        title: '到底咯^_^',
        image: '../../Resources/Images/Music/smile.png'
      })
    }
  },
  lifetimes: {
    attached(){
      // HotSong List /hotSongList?key=579621905&limit=6
      requests.requestSongListorMV('/songList/hot?pageSize=6',(data)=>{
        if (data.data.length!=0){
            this.setData({
              hotSongList: this.data.hotSongList.concat(data.data)
            })
          }else{
            this.setData({
              hotSongList: []
            })
          }
      },()=>{
          console.log('请求异常，请重试!')
      });
      // highQuantity List  /highQualitySongList?key=579621905&limit=6
      requests.requestSongListorMV('/songList/highQuality?pageSize=6', (data)=>{
        if (data.data.length!=0){
          this.setData({
            highQuantityList: this.data.highQuantityList.concat(data.data)
          })
        }else{
          this.setData({
            highQuantityList: []
          })
        }
      },()=>{
        console.log('请求异常，请重试!')
      });
      // 最新专辑 用于顶部广告栏
      requests.requestSongListorMV("/album/newest",(data)     =>{
        this.setData({
          albumList: this.data.albumList.concat(data.data.slice(0,9))
        })
      },
      ()=>{
        this.setData({
          albumList: []
        })
      });
      // Top MV topMvList?key=579621905&limit=6
      
      requests.requestSongListorMV("/mv/top?pageSize=6", (data)=> {
        if(data.data.length!=0){
          this.setData({
            mvList: data.data
          })
        }else {
          this.setData({
            mvList: []
          })
        }
      },()=>{
            console.log('请求异常，请重试!')
      })
    },
    detached(){

    }
  },
  pageLifetimes: {
    show: function(){
      this.setData({
        playing: app.globalData.playing,
        songId: app.globalData.curplay.id ? app.globalData.curplay.id : null
      })
    }
  }
})
