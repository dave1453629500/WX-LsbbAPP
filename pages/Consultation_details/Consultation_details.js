
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
        detailsTime: ""              // 回复数据的时间                   
}
var   detailsData = [];    // 创建回复的每条数据

Page({

        /**
         * 页面的初始数据
         */
        data: datas,

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var dataJson = JSON.parse(options.a);   // 获取解析的data
               
                // 循环一下 传回的数据ID
                for (var key in dataJson.answer){              
                        detailsData.push(dataJson.answer[key]);
                };
                 this.setData({
                         logo: Utils.url + dataJson.faq.image,         // 头像
                         Mobile: dataJson.faq.nickname,// 手机号码
                         category1: dataJson.faq.cat_big,// 类别1
                         category2: dataJson.faq.cat_small,// 类别2
                         content: dataJson.faq.content,    // 内容
                         money: dataJson.faq.money,    // 金额
                         place: dataJson.faq.city_name,    // 地点
                         time: dataJson.faq.date,    // 几分钟前
                         detailsArr: detailsData      // 回复数据的list
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