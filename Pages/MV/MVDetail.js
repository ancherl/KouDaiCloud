// Pages/MV/MVDetail.js
var requests = require("../../Requests/neteaseMusicAPI.js");
var common = require("../../Utils/common.js")

Page({
  data: {
    tab: 0,
    mvDetail: null,
    mvURL: null,
    wifi: false,
    coverImg: null,
    mvId: null,
    hotComments:[],
    comments: [],
    totalComments: null,
    windowHeight: null
  },
  onLoad: function (options) {
    var that = this;
    requests.mvDetailRequest("/mv", options.mv_id, (data)=>{
      if(data.data.data){
         wx.getNetworkType({
           success: function(res) {
            that.setData({
              mvDetail: data.data.data,
              wifi: res.networkType=='wifi' ? true : false,
              coverImg: data.data.data.cover,
              mvId: options.mv_id,
              windowHeight: wx.getSystemInfoSync().windowHeight
            })
           },
         })
      }else{
        that.setData({
          mvDetail: null
        })
      };
      wx.setNavigationBarTitle({
        title: data.data.data.name,
      })
    },()=>{
      console.log('请求异常，请重试!')
    });
// mv url 获取
    requests.mvDetailRequest("/mvUrl?isRedirect=0&quality=1080", options.mv_id, (data)=>{
      if(data.data){
        that.setData({
          mvURL: data.data
        })
      }else{
        that.setData({
          mvURL: null
        })
      }
    }, ()=>{
      console.log('请求异常，请重试!')
    })

  },
  onReady: function () {
  },
  onShow: function () {
    
  },
  onShareAppMessage: function () {

  },
  tab: function(e){
    if (e.currentTarget.dataset.tab == 0){
      this.setData({
        tab: 0
      })
    } else if (e.currentTarget.dataset.tab == 1){
      this.setData({
        tab: 1
      });
      // 加载mv评论列表
      requests.mvDetailRequest("/comment/mv?page=0&pageSize=30", this.data.mvId, (data)=>{
        console.log(data);
        if(data.data){
          this.setData({
            hotComments: this.data.hotComments.concat(data.data.hotComments),
            comments: this.data.comments.concat(data.data.comments),
            totalComments: data.data.total
          })
        }
      }, ()=>{
        console.log('请求异常，请重试!')
      })
    } else {
    this.setData({
      tab: 2
    })
    }
  }
})