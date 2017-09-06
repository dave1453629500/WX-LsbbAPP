// 走起 我的函数库~
var Utils = require("../../utils/util.js");
var loginArr = {        // 本地存储的手机号、密码
        phone:"",
        pasd:""
};
var loginJson = {       // 存储登陆返回的信息
        image: "",
        nickname: "",
        sdk: "",
        status: "",
        telphone: "",
        types: "",
        uid:"",
}
// 默认数据
var defaultData = {
    loginBtnTxt:"登陆",           
    btndisabled:false,
    btnLoading: false,
    loginBtnBgBgColor:"#e64444",
    checkboxVal:"0" ,
    pasd:"",    // 密码
    phone:"", // 手机号码
    bool:true                     
}
Page({                                                  // page项
data: defaultData,
  formSubmit:function(e){
    var formVal = e.detail.value;
    this.mysubmit(formVal);
  },
  onLoad: function (options) {
        //   页面加载的时候判断 记住手机号密码是否勾选
          var doBool = this.data.bool;
          var loginValue = wx.getStorageSync("success");
          if (doBool){
                  this.setData({
                          phone: loginValue.phone,
                          pasd: loginValue.pasd
                  })
          }else{
                  Utils.removeStorage('success');
          }
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
mysubmit:function(param){                   // 提交
   var _this = this;
    var flag = this.checkPhone(param) && this.checkPassword(param);
    loginArr = {        // 本地存储的手机号、密码
            phone: param.tel,
            pasd: param.pasd
    }
    if ( !!flag ) {
        // this.SuccessFn();
        var checkVal = param.checkboxval.join("");
        if (!checkVal.length) {
                Utils.removeStorage('success');
        }else{
             
                Utils.setStorage('success', loginArr);
        }
        wx.request({
            url: Utils.url + '/index.php/Login/index?server=1',
            method:"POST",
            data: {         // 传递的参数
                userphone: param.tel,           
                passwd: param.pasd
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {           // 成功、返回的数据
                if (res.data.status){             // 登陆成功
                    wx.redirectTo({               // 跳转别的页面，关闭当前页面
                        url: "/pages/Consultation/Consultation"
                    })
                    loginJson = {                // 存储登陆状态      
                            image: res.data.data.image,
                            nickname: res.data.data.nickname,
                            sdk: res.data.data.sdk,
                            status: res.data.data.status,
                            telphone: res.data.data.telphone,
                            types: res.data.data.type,
                            uid: res.data.data.uid
                    }
                    Utils.setStorage("login", loginJson);     // 存储到本地缓存
                }else{
                    Utils.showModal(res.data.message);
                    return false;
                }
            },
            fail:function(){                      // 失败、调取状态 
            console.log("请求失败")
            _this.failFn();
            }
        })
    }
  },
SuccessFn:function(){                 // 验证成功的状态
    this.setData({
        loginBtnTxt:"登陆中",
        btndisabled: true,
        btnLoading: true,
        loginBtnBgBgColor: "#666"
    })
  },
failFn:function(){                        // 验证失败的状态、回复到默认状态
  this.setData({
      loginBtnTxt: "登陆",
      btndisabled: false,
      btnLoading: false,
      loginBtnBgBgColor: "#e64444",
      checkboxVal: 0   
    })
  Utils.showModal("账号密码错误");
  return false;
},
  checkPhone: function (val) {            // 验证手机号
      var checkVal = Utils.Verification.phone;
      var thisVal = val.tel;
      if (!checkVal.test(thisVal ) ){
          Utils.showModal("请输入正确的手机号码");
          return false;
      }
        return true;
  },
  checkPassword:function(val){          // 验证密码
      var thisVal = val.pasd.trim();
      if ( thisVal.length < 6 ) {
          Utils.showModal("请输入至少6位的密码");
          return false;
      }
          return true;
  },
  checkboxChange: function (e){            // 记住密码
      var val = e.detail.value;
      Utils.removeStorage('success');
  }
})