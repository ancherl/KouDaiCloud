const BaseUrl ='https://douban.uieee.com/v2';
// https://douban.uieee.com/v2  备用
// http://t.yushu.im/v2

// 关键字搜索movie
function requestSearchMovie(queryStr, successcb, failcb){
  wx.request({
    method: 'GET',
    url: BaseUrl +'/movie/search',
    data: {
      q: queryStr
    },
    header: {
      'Content-Type': 'json'
    },
    dataType: 'json',
    success: function(res){
      if(res.statusCode==200 && typeof successcb === 'function'){
        successcb(res.data);
      }else{
        console.log('请求异常!')
      }
    },
    fail: function(e){
      failcb()
    }
  })
}

function requestMovieIntheaters(successcb, failcb){
  wx.request({
    url: BaseUrl+'/movie/in_theaters',
    method: 'GET',
    header: {
      'Content-Type': 'json'
    },
    dataType: 'json',
    success: (res) => {
      if (res.statusCode == 200 && typeof successcb === 'function') {
        successcb(res.data);
      } else {
        console.log('请求异常!')
      }
    },
    fail: ()=> {
      failcb()
    }
  })
}
//Movie Detail
function requestMovieDetail(id,successcb, failcb, completecb){
  wx.request({
    url: BaseUrl+'/movie/'+id,
    method: 'GET',
    dataType: 'json',
    header: {
      'Content-Type': 'json'
    },
    success: (res)=>{
      if (res.statusCode == 200 && typeof successcb === 'function') {
        successcb(res.data);
      } else {
        console.log('请求异常!')
      }
    },
    fail: () =>{
        failcb();
    },
    complete: ()=>{
      completecb();
    }
  })
}

module.exports={
  requestSearchMovie: requestSearchMovie,
  requestMovieIntheaters: requestMovieIntheaters,
  requestMovieDetail: requestMovieDetail
}