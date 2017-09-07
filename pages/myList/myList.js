// 加载地图
var map = require('../../map/mappos.js');  

var commData = {
    image:"/images/user.png",       // 头像
    usrename:"没有名字",            // 姓名
    positions:"" ,      // 位置
    pos: 1      // 判断是不是定位中的状态
    
} 

Page({
data: commData,
onLoad: function () {
        this.getStorage();          // 加载登陆的信息
        this.coordinate();              //加载位置
},
getStorage:function(){
        var _this = this;
        var commDatas = _this.data;
        wx.getStorage({
                key: 'login',
                success: function (res) {
                        var dataArr = res.data;
                        _this.setData({
                                image: dataArr[2] || commDatas.image,
                                usrename: dataArr[1] || commDatas.usrename
                        })
                }
        })
},
coordinate:function(){
        var _this = this;
        _this.setData({
                positions: "定位中..",
                pos: 0
        })
        var qqmapsdk = map.map();
        qqmapsdk.reverseGeocoder({
                complete: function (res) { // 获取位置成功返回
                        var city = res.result.address_component.city;   // 市
                        city = city.substring(0, city.length - 1);       // 去掉“市”的后缀
                        _this.setData({
                                positions: city,
                                pos:1
                        })
                },
                fail: function (res) {  // 获取位置失败
                        _this.setData({
                                positions: `保定`,
                                pos: 1
                        })
                        Utils.showModal("获取位置失败网络错误");
                }
        })
},
JumpFn:function(){            // 跳转
        wx.redirectTo({
                url: '/pages/Consultation/Consultation'
        })
}
})