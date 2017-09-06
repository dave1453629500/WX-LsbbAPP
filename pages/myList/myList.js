
var commData = {
    image:"/images/user.png",
    usrename:"没有名字"
} 

Page({
    data: commData,
    onLoad: function () {
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
    JumpFn:function(){            // 跳转
            wx.redirectTo({
                    url: '/pages/Consultation/Consultation'
            })
    }
})