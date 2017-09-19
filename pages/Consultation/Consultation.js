// 走起 我的函数库~
var Utils = require("../../utils/util.js");
var page = 0;       // 页数

// 默认加载数据
var defaultData = {
        results: [] ,             // 加载默认的数据
        scrollTop:0,           // 记录scrollTop的值   
        navAtrr: ['最新', "婚姻家庭", "债权债务", "劳动纠纷"],
        navPage:["","hyjt",'zqzw','ldjf'],      // 传值
        value:"0" ,             //nav点击的时候对应的value 
        layerArr:["回复","时间","打赏"],   // 排序
        layerVal:"3",  // 排序弹层val
        sortID:"0",            // 排序ID
}

Page({                                                  // page项
    data: defaultData,
    loadMore: function (that, page, smallVal, order){            // 滚动的公共函数、发送ajax
        smallVal =  typeof smallVal == "undefined" ? "" : smallVal;
        order =    typeof order == "undefined" ? "" : order;
        wx.request({
            url: Utils.url + '/index.php/consult?server=1',
            method: "POST",
            data: {
                p: page,
                small: smallVal,
                order: order || ""
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                var redata = res.data.data.list;
                that.setData({
                    results: that.data.results.concat(redata)
                });
            },
            complete:function(){               // 请求结束 结束动画等等
                wx.stopPullDownRefresh();        //停止下拉刷新
                wx.hideLoading();                      // 停止加载中的动画
            }
        })
    },
  onLoad: function (options) {
       // 页面初始化 、加载请求数据
        var _this = this;
        page = 1;
        _this.loadMore(_this, page);
        Utils.removeStorage("Reset");
  },
  onReady: function () {
 
  },
  onShow: function () {
      // 页面显示
    
  },
  onHide: function () {
      // 页面隐藏
    
  },
  onUnload: function () {
      // 页面关闭
  },
  commvalFn:function(){     // 公共求值
      var _this = this;
      return {
          data: _this.data.value,
          navArr: _this.data.navPage,
          layerVal: _this.data.layerVal
      }
  },
  onPullDownRefresh:function(){  // 上拉
  },
  onReachBottom:function(){   // 下拉加载触发
      var _this = this;
      page++;
      wx.showLoading({          // 加载动画
          title: '加载中',
      })

      var res = this.commvalFn();

      if (res.layerVal == "3"){      // 滚动的时候判断是否排序
          switch (res.data) {
              case "0":
                  _this.loadMore(_this, page, res.navArr[res.data]);
                  break;
              case "1":
                  _this.loadMore(_this, page, res.navArr[res.data]);
                  break;
              case "2":
                  _this.loadMore(_this, page, res.navArr[res.data]);
                  break;
              case "3":
                  _this.loadMore(_this, page, res.navArr[res.data]);
                  break;
              default:
                  _this.loadMore(_this, page);
          };
      }else{
          switch (res.layerVal) {
              case "0":
                  _this.loadMore(_this, page, res.navArr[res.data], "1");
                  break;
              case "1":
                  _this.loadMore(_this, page, res.navArr[res.data], "2");
                  break;
              case "2":
                  _this.loadMore(_this, page, res.navArr[res.data], "3");
                  break;
          }
      }
  },
  dolayerFn: function (e) {       // 排序弹层触发
      var _this = this;
      var doId = e.target.id;
      _this.setData({
          layerVal: doId,
          sortID: "0"
      })
      var res = this.commvalFn();  //放在修改data数据之后
      page = 1;       // 每次点击切换的时候强制让page = 1;
        
      switch (res.layerVal) {
          case "0":
              _this.rollFn(res.navArr[res.data], "1");
              break;
          case "1":
              _this.rollFn(res.navArr[res.data], "2");
              break;
          case "2":
              _this.rollFn(res.navArr[res.data], "3");
              break;
      }
  },

navFn:function(e){      // 点击nav the list
    var _this = this;
    var doId = e.target.id;

    _this.setData({
        value: doId
    });

    var res = this.commvalFn();  //放在修改data数据之后

    page = 1;       // 每次点击切换的时候强制让page = 1;
    switch (_this.data.value) {
        case "0":
            _this.rollFn();
            break;
        case "1":
        _this.rollFn(res.navArr[_this.data.value]);
            break;
        case "2":
        _this.rollFn(res.navArr[_this.data.value]);
            break;
        case "3":
        _this.rollFn(res.navArr[_this.data.value]);
            break;
    }
  },
rollFn: function (name, order) {          // 切换滚动的时候清空请求接口

        name = typeof name == "undefined" ? "" : name;
        order = typeof order == "undefined" ? "" : order;

        var _this = this;
        this.setData({
                results: []
        });

        this.loadMore(_this, page, name, order);
},
sortFn:function(){          // 点击排序展开、收起
    var doid = this.data.sortID;
    doid = doid == "0"? "1":"0";
    this.setData({
        sortID: doid
    });
},
myNews:function(){      // 点击我的页面
    Utils.setStorage("Reset","/pages/myList/myList"); // 登陆后返回这个页面 记录
    var value = wx.getStorageSync('login');   // 获取到key
    if (value != ""  ){
        wx.redirectTo({
                url: '/pages/myList/myList'
        })
    }else{
        wx.redirectTo({
            url: '/pages/forgot_password/forgot_password'
        })
    }
},

ConsultationFn:function(){      // 咨询跳转
        wx.navigateTo({
        url:'/pages/addimages/addimages'
    })
},
jumpFn:function(e){              // 点击进入详情
        var DoId = e.currentTarget.id;          // 发送的对应详情的唯一ID值
        var datas = "";
        var loginDatas = wx.getStorageSync("login");    // 获取登陆信息
        var loginJosn = {};
        wx.request({
            url: Utils.url + '/index.php/consultdetail?server=1',
            data: {
                sdk: loginDatas.sdk || "",
                uid: loginDatas.uid || '',
                id: DoId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                datas = JSON.stringify(res.data.data);
                // 记录一下传入详情的值，为详情刷新做准备
                loginJosn = {
                    sdk: loginDatas.sdk || "",
                    uid: loginDatas.uid || "",
                    id: DoId
                }
                Utils.setStorage("details", loginJosn)
                wx.navigateTo({
                    url: "/pages/Consultation_details/Consultation_details?a=" + datas
                })

            }
        })
}
})
