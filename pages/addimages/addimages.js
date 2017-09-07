var Utils = require("../../utils/util.js");

var datalist = {
    textareaFocus:true,                              // 文本域的自动调取键盘
    textareaVal: "",                                     // 文本域的val
    arrimg:[],           // 上传img的attr     => 页面显示的img                  
    len:4,              // 上传的img的最大的length
    index: 0,         // 上传完成的个数
    successArr:[],      // 存储上传返回的img的url =>发送的数据
    questions:{}        // 提交数据存储到本地的josn
}
Page({
    data:datalist,
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        Utils.removeStorage("tw")
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
    submitFn: function () {   // 提交数据
        var _this = this;
        // 获取到  textarea的val
        var textareaVal = this.data.textareaVal;
        // 获取到上传成功返回的img的src the list
        var imgsList = this.data.successArr;
        // 获取到本地存储的数据
        var questions = _this.data.questions;
        
        if (textareaVal.trim() != "") {
        var value = wx.getStorageSync('login');
            if (value != "") {
                // 提交的数据 不为空的话 那么就存储到本地
                questions.textareaVal = textareaVal;
                questions.url = imgsList;
                Utils.setStorage("tw", questions);
                wx.navigateTo({
                        url: '/pages/questions/questions'
                })
            } else {
                wx.redirectTo({
                    url: '/pages/login/login'
                })
            }
        }else{
            Utils.showModal("问题不能空");
            return false
        }
    },
    textareaFn: function (ev) {        // 输入动态获取textarea的value
        this.setData({
            textareaVal: ev.detail.value
        })
    },
    chooseimage:function(e){
        this.chooseImageFn();   // 上传的fn
    },
    chooseImageFn:function(){   // 上传的fn
     var _this = this;
     var len = _this.data.len;   // 获取data的上传的总个数
     var mun = _this.data.index;  // 获取data的上传完成的个数
     var arr = _this.data.arrimg;         // 获取data的img的list 
     var suArr = _this.data.successArr; // 存储上传返回的img的src
     // 调取手机的上传
     wx.chooseImage({
         count: 1,
         sizeType: ['original', 'compressed'],
         sourceType: ['album', 'camera'],
         success: function (res) {       // 成功
             var tempFilePaths = res.tempFilePaths.toString();
             len == mun ? mun = 4 : mun++;
             if (_this.data.index <= 3) {// 上传之前的验证个数

                 arr.push(tempFilePaths);
                 _this.setData({
                     arrimg: arr,
                     index: mun
                 })

                 wx.uploadFile({   // 上传
                     url: Utils.url + '/index.php/upload?server=1',
                     filePath: arr[arr.length - 1],
                     name: 'file',
                     formData: {
                         'user': 'test'
                     },
                     success: function (res) {
                             console.log(res)
                         // 返回上传完成的img的src
                         var path = Utils.url + JSON.parse(res.data).data.path;
                         suArr.push(path);
                         _this.setData({
                             successArr: suArr
                         })
                     }
                 })
             }
         }
     })
    },
    closeImgFn:function(e){
        var doId = e.currentTarget.id;      // 对应的img的唯一id
        var doarrimg = this.data.arrimg;    // 页面显示的img the list    
        var doindex = this.data.index;   // 上传显示的个数
        var suArr = this.data.successArr;      // 发送的img的list的数组
        doarrimg.splice(doarrimg[doId], 1);     // 删除当前的下标的数组
        suArr.splice(suArr[doId], 1); 
        doindex --;       // 删除一个上传的个数就递减
        this.setData({
            arrimg: doarrimg,
            index: doindex,
            successArr: suArr
        })
    }
});