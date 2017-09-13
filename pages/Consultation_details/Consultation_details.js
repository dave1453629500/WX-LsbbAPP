
var Utils = require("../../utils/util.js");
var datas = {
        logo:"/images/user.png",       // 头像
        Mobile:"13032014099",        // 手机
        category1: "民事类",            // 类别1
        category2:"综合",                // 类别2 
        content:"测试的content",        // 内容
        money:"",                      // 金额
        place: "北京",             // 地点
        time:"1分钟前",            // 时间
        detailsContent: "",         // 回复数据的内容            
        detailsTime: "",              // 回复数据的时间 
        faqid:"",        // 本页面的ID
        nReply:0,        // 回复的弹出层
        len:"",     // 回复的数量
}
Page({
        /**
         * 页面的初始数据
         */
        data: datas,

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var dataJson = "";  // 接受数据
                dataJson = JSON.parse(options.a);   // 获取解析的data
                this.assignment(dataJson)
        },
        replyFn:function(e){ // 回复
            this.setData({
               nReply:1,
               parent_id: e.currentTarget.dataset.parent_id,
               master_id: e.currentTarget.dataset.master_id
           })
        },
        ondataFn:function(){  // 点击回复弹层调转穿参
            var loginData = wx.getStorageSync("login");
            if (!loginData) return false;
            var faqid = this.data.faqid;
            var _this = this;
            var resDatas = {
                parent_id: _this.data.parent_id,
                master_id: _this.data.master_id,
                sdk: loginData.sdk,
                uid: loginData.uid,
                faqid: faqid,
            }
            resDatas = JSON.stringify(resDatas);
            wx.navigateTo({
                url: `/pages/Reply/Reply?data=${resDatas}`
            })
        },
        assignment: function (dataJson){    // 每次加载数据的赋值操作
            var detailsData = [];   // 每次加载的时候清空一次
            for (var key in dataJson.answer) {
                detailsData.push(dataJson.answer[key]);
            };
          
            this.setData({
                len: detailsData.length,        // 回复的len
                logo: Utils.url + dataJson.faq.image,         // 头像
                Mobile: dataJson.faq.nickname,// 手机号码
                category1: dataJson.faq.cat_big,// 类别1
                category2: dataJson.faq.cat_small,// 类别2
                content: dataJson.faq.content,    // 内容
                money: dataJson.faq.money,    // 金额
                place: dataJson.faq.city_name,    // 地点
                time: dataJson.faq.date,    // 几分钟前
                detailsArr: detailsData,      // 回复数据的list
                faqid: dataJson.faq.id     // 本页面的iD
            })
           
        },
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
           
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
            var _this = this;
            var loginDatas = wx.getStorageSync("details"); // 获取到本地的请求的参数
            var datares = {};
            wx.request({ // 重新获取数据
                url: Utils.url + '/index.php/consultdetail?server=1',
                data: {
                    sdk: loginDatas.sdk || "",
                    uid: loginDatas.uid || '',
                    id: loginDatas.id
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    datares = res.data.data;
                    _this.assignment(datares);
                }
            })
        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () {
        
        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        },
        /**
         * 设置转发的的功能
         */
        onShareAppMessage:function(){

        }
})