// Pages/MovieDetail/moviedetail.js
var requests = require('../../Requests/doubanAPI.js');

Page({
  data: {
      id: null,
      detailData: null,
      director: null,
      casts: null,
      movieType: null
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  onReady: function () {
      wx.showLoading({
        title: '正在加载数据',
        mask: true
      });
    requests.requestMovieDetail(this.data.id,(data)=>{
      if(data){
        this.setData({
          detailData: data,
          casts: data.attrs.cast.join('/'),
          director: data.attrs.director[0],
          movieType: data.attrs.movie_type.join('/')
        })
      }else{
        this.setData({
          detailData: null
        })
      }
    },
    ()=>{
      this.setData({
        detailData: null
      })
    },
    ()=>{
      wx.hideLoading();
    })
  },
  onShow: function () {

  },
  onUnload: function () {

  }
})