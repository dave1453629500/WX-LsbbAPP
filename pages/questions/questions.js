
// 函数库
var Utils = require("../../utils/util.js");
// 地图
var map = require('../../map/mappos.js');  

var datalist = {
    arr:[8,18,28,58,68,88],                  // 价钱的金额
    value:"0",
    doJson:{},                                    // 获取本地存储的login数据
    openid :"",
   citysData: "", // 请求的数据
    province: "",  // 数组省
    city: "", // 数组市
    area: "", // 数组区
    valueArr: [0, 0, 0],  // 默认值
    name: " ", // 赋值
    maskDis:0,   // 控制遮罩层的显示隐藏
    latitude: "",        // 维度
    longitude: "",       // 经度
    pos:0      // 判断是否在加载中
};

Page({
    data:datalist,
    onLoad: function (options) {        // 页面加载
      
        this.getStorage();  // 获取login数据
        this.request(); // 请求省市区的接口
        this.loadCity(); // 获取经纬
        this.coordinate();  // 加载位置       
             
    },
getStorage: function () {// 取得存储的login数据
        var _this = this;
        var getSto = wx.getStorageSync("login");
        _this.setData({   // 存储返回的login的本地数据
                doJson: getSto
        })
        _this.loginFn(_this.data.doJson);  // 调取login的状态
},
request:function(){ // 请求省市区的接口
        var _this = this;
            wx.request({
                    url: Utils.url + '/index.php/getAreas?server=1',
                    header: {
                            'content-type': 'application/json'
                    },
                    success: function (res) {
                            var dataJson = res.data.data;
                            _this.setData({
                                    citysData: dataJson
                            })
                    }
            })
    },
coordinate:function(){  // 获取位置
        // 调用接口
        var _this = this;
        _this.setData({
                name: `定位中..`,
                pos: 0
        })
        var qqmapsdk = map.map();
        qqmapsdk.reverseGeocoder({
                complete: function (res) { // 获取位置成功返回
                        // res.result.address  获取具体的地址位置

                        var province = res.result.address_component.province;   // 省
                        var city = res.result.address_component.city;   // 市
                        var district = res.result.address_component.district;   // 区
                       
                        province = province.substring(0, province.length - 1);  // 去掉“省”的后缀
                        city = city.substring(0, city.length - 1);       // 去掉“市”的后缀
                   
                        _this.setData({
                                name: `${province}-${city}-${district}`,
                                pos:1
                        })
                },
                fail: function (res) {  // 获取位置失败
                        _this.setData({
                                name: `请手动获取位置`,
                                pos: 1
                        })
                        Utils.showModal("获取位置失败网络错误");
                }
        })
},
loginFn: function (obj){    // 页面加载 请求login状态
        var _this = this;
        var dosdk = obj.sdk;        // sdk
        var douid = obj.uid;    // uid
        wx.login({
        success: function (res) {
                if (res.code) { //  第一步： 获取code
                wx.request({
                        url: Utils.url + '/index.php/getopenid?server=1',
                        method: "POST",
                        data: {
                        code: res.code,
                        sdk: dosdk,
                        uid: douid
                        },
                        header: {
                        'content-type': 'application/json'
                        },
                        success: function (res) {
                        _this.setData({
                                openid: res.data.data.openid
                        })
                        }
                })
                } else {
                console.log('获取用户登录态失败！' + res.errMsg)
                }
        }
        });
},
getLocation: function () {
        var page = this
        wx.getLocation({
            type: 'wgs84',  
            success: function (res) {
                // success    
                var longitude = res.longitude
                var latitude = res.latitude
            }
        })
},
loadCity: function (longitude, latitude) {       // 获取经纬
        var _this = this;
        wx.getLocation({
                type: 'gcj02', // 不能选择 wgs84 地图应该是gcj02 用于地图
                success: function (res) {
                        _this.setData({
                                latitude: res.latitude,
                                longitude: res.longitude
                        })
                }
        })
},
initFn:function(){  // 初始化
        var nPos = this.data.pos;
        if (nPos != 1) return false;    // 如果pos = 0 的话 那么就是还在加载中、不能点击
        this.onloadFn();
},
onloadFn:function(){        // 加载省市区
        var aProvince = [];     // 存储省
        var citys = [];              //存储 市
        var areas = [];          //存储 区

        var citysData = this.data.citysData;
        var oProvince = citysData[this.data.valueArr[0]];

        citysData.forEach(function (province, i) {
                aProvince.push(province.name);
        })
        oProvince.citys.forEach(function (res) {
                citys.push(res.name)
        })
        areas = oProvince.citys[this.data.valueArr[1]].areas;
        var pos = this.data.valueArr;
        this.setData({
                maskDis: 1,
                province: aProvince,
                city: citys,
                area: areas
        })
},
bindChange: function (e) {          // 滑动省市区
        var citysData = this.data.citysData;        // 获取到总数据
        var posValue = this.data.valueArr;          // 获取到默认值的array
        var curentValue = e.detail.value;            // 获取到滚动的array
        var oProvince = {};     // 省份的数据
        var aCitys = [];         // 城市的数组list
        var oCitys = {};        // 城市的数据
        oProvince = citysData[curentValue[0]];          // 获取到省份

        if (posValue[0] != curentValue[0]) {    // 如果省份默认值与省份滚动值不相等，那么就是滚动的省份
                oProvince.citys.forEach(function (data) { // 利用省份获取对应子集的市区数组
                        aCitys.push(data.name);
                })
                oCitys = oProvince.citys[0];    // 显示市区数组第一个
                this.setData({
                        city: aCitys,   // 赋值对应市区数组
                        area: oCitys.areas,             // 区域数组
                        valueArr: [curentValue[0], 0, 0]  // 赋值第一个省份
                })
        } else if (this.data.valueArr[1] != curentValue[1]) {      // 以此判断市
                if (curentValue[1] >= oProvince.citys.length) return;  // 数据不存在
                oCitys = oProvince.citys[curentValue[1]];
                this.setData({
                        area: oCitys.areas,
                        valueArr: [curentValue[0], curentValue[1], 0]
                })
        } else {  // 滚动的是区域
                oCitys = oProvince.citys[curentValue[1]];
                this.setData({
                        valueArr: curentValue
                })
        }
        this.setData({
                name: `${oProvince.name}-${oCitys.name}-${oCitys.areas[this.data.valueArr[2]]}`
        })
},
CloseFn:function(){ // 关闭遮罩层
        this.setData({
                maskDis:0
        })
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
thisVal:function(ev){  // 点击价格获取当前的价格
        this.setData({
            value: ev.target.id
        });
},
releaseFn:function(){  // 提交数据
        var _this = this;

        var resData = wx.getStorageSync('login');   // 获取登陆的信息
        var twData = wx.getStorageSync('tw');   // 获取登陆的信息
        var money = _this.data.arr[_this.data.value];  // 点击的时候能获取到打赏金额

        var City = _this.data.name.split("-")[1];               // 城市
        
        wx.request({
                url: Utils.url + '/index.php/faqprepay?server=1',
                method: "POST",
            data: {
                sdk: resData.sdk,    // 登陆的sdk
                uid: resData.uid,    // 登陆的uid
                title: twData.textareaVal, // 快速咨询的val
                content: twData.textareaVal,// 快速咨询的val
                city: City,       // 城市
                pay_type: "1", // 支付方式
                money: money,      // 价格
                img1: twData.url[0] || "",         // 上传的img1
                img2: twData.url[1] || "",        // 上传的img2
                img3: twData.url[2] || "",        // 上传的img3
                img4: twData.url[3] || "",         // 上传的img4
                openid: _this.data.openid  // openid
            },
            success:function(res){
                if (res.data.status) {
                    var payModel = res.data.data
     
                   //  获取微信支付的数据
                    wx.requestPayment({
                         'timeStamp': payModel.timeStamp,
                        'nonceStr': payModel.nonceStr,
                        'package': payModel.package,
                        'signType': 'MD5',
                        'paySign': payModel.paySign,
                        "total_fee":"8",
                        'success': function (res) {   // 成功的状态
                               Utils.showModal("支付成功");
                               return false;
                        },
                        'fail': function (res) {      // 失败的状态
                                Utils.showModal("失败");
                                return false;
                        }
                    })
                }
            }
        })
    }
})