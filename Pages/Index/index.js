// Pages/Index/index.js
var requests=require('../../Requests/doubanAPI.js');

Page({
  data:{
    inputInitialValue: '',
    clearIconDisplay: 'none',
    scrollHeight: 0,
    pageIndex: 0,
    totalRecord: 0,
    pageRows: [],
    searchKey: ''
  },

  onLoad: function(options){
    wx.showLoading({
      title: '正在加载中',
      mask: true
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight - (100 * res.windowWidth / 750)
        })
      }
    });

    //  Movie In theaters request
    intheatersRequestData.call(this);
    wx.hideLoading()
  },
  
  // 页面显示时触发
  onShow: function(){
    
  },
  // 下拉刷新&加载数据
  onPullDownRefresh: function(){
    //  Movie In theaters request
    intheatersRequestData.call(this);
    setInterval(function () {
      wx.stopPullDownRefresh()
    }, 2000)

  },
  // 到达底部时触发
  scrolltolower: function(e){
    wx.showToast({
      title: '已经到底了哦',
      duration: 1000
    })
  },
  // 电影关键字search
  searchInputEvent: function(e){
    this.setData({
      searchKey: e.detail.value,
      clearIconDisplay: e.detail.value=='' ? 'none' : 'block'
    }); 
  },
  searchClickEvent: function(e){
    searchKeyRequestData.call(this)
  },
  clickConfirmButton: function(e){
    searchKeyRequestData.call(this)
  },
  // Clear icon clicked
  clearClickEvent: function(e){
    this.setData({
      inputInitialValue: '',
      clearIconDisplay: 'none'
    });
    intheatersRequestData.call(this);
  },
  toDetailPage: (e)=>{
    var mid=e.currentTarget.dataset.mid; //获取passed movie id
    wx.navigateTo({
      url: '../MovieDetail/moviedetail?id='+mid,
    })
  }
})

// console.log(getApp().globalData);

function searchKeyRequestData(){
  var _this = this;
  // 清空之前Load的数据
  _this.setData({
    pageRows: []
  });
  requests.requestSearchMovie(this.data.searchKey, function (data) {
    if (data.total == 0) {
      _this.setData({
        totalRecord: 0
      })
    } else {
      _this.setData({
        pageIndex: data.start + 1,
        totalRecord: data.count,
        pageRows: _this.data.pageRows.concat(data.subjects)
      })
    }
  }, function () {
    _this.setData({
      totalRecord: 0
    })
  })
}
// 最近热映 初始化加载 || 下拉刷新
function intheatersRequestData(){
  var _this = this;
  _this.setData({
    pageRows: []
  });
  requests.requestMovieIntheaters(function (data) {
    if (data.total == 0) {
      _this.setData({
        totalRecord: 0
      })
    } else {
      _this.setData({
        pageIndex: data.start + 1,
        totalRecord: data.count,
        pageRows: _this.data.pageRows.concat(data.subjects)
      })
    }
  }, function () {
    _this.setData({
      totalRecord: 0
    })
  })
}
