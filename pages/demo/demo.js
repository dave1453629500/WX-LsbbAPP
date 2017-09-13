// Page({
//         data: {
//                 citysData:"", // 请求的数据
//                 province: "",  // 数组省
//                 city: "", // 数组市
//                 area:"", // 数组区
//                 valueArr:[0,0,0],  // 默认值
//                 name:"" // 赋值
//         },
//         initFn: function () {        // 初始化
//                 var aProvince = [];     // 存储省
//                 var citys = [];              //存储 市
//                 var areas = [];          //存储 区

//                 var citysData = this.data.citysData;
//                 var oProvince = citysData[this.data.valueArr[0]];
           
//                 citysData.forEach(function (province, i) {
//                         aProvince.push(province.name);
//                 })
//                 oProvince.citys.forEach(function(res){
//                         citys.push(res.name)
//                 })
//                 areas = oProvince.citys[this.data.valueArr[1]].areas;
//                 var pos = this.data.valueArr;
//                 this.setData({
//                         province: aProvince,
//                         city: citys,
//                         area: areas,
//                         name: `${aProvince[this.data.valueArr[0]]}--${citys[this.data.valueArr[1]]}--${areas[this.data.valueArr[2]]} `
//                 })
//         },
//         onLoad: function (options) {
//                 var _this = this;
//                 wx.request({
//                         url: 'https://m.12348.com.cn/index.php/getAreas?server=1',
//                         header: {
//                                 'content-type': 'application/json'
//                         },
//                         success: function (res) {
//                                 var dataJson = res.data.data;
//                                 _this.setData({
//                                         citysData: dataJson
//                                 })
//                         }
//                 })
//         },
//         bindChange: function (e) {
             
//                 var citysData = this.data.citysData;        // 获取到总数据
//                 var posValue = this.data.valueArr;          // 获取到默认值的array
//                 var  curentValue = e.detail.value;            // 获取到滚动的array
//                 var oProvince = {};     // 省份的数据
//                 var aCitys = [];         // 城市的数组list
//                 var oCitys = {};        // 城市的数据
//                 oProvince = citysData[curentValue[0]];          // 获取到省份
            
//                 if (posValue[0] != curentValue[0] ){    // 如果省份默认值与省份滚动值不相等，那么就是滚动的省份
//                         oProvince.citys.forEach(function(data){ // 利用省份获取对应子集的市区数组
//                                 aCitys.push(data.name);
//                         })
//                         oCitys = oProvince.citys[0];    // 显示市区数组第一个
//                         this.setData({
//                                 city: aCitys,   // 赋值对应市区数组
//                                 area: oCitys.areas,             // 区域数组
//                                 valueArr: [curentValue[0],0,0]  // 赋值第一个省份
//                         })
//                 } else if (this.data.valueArr[1] != curentValue[1]){      // 以此判断市
//                         if (curentValue[1] >= oProvince.citys.length) return ;  // 数据不存在
//                         oCitys = oProvince.citys[curentValue[1]];
//                        this.setData({
//                                area: oCitys.areas,
//                                valueArr: [curentValue[0], curentValue[1], 0]
//                        })
//                 } else{  // 滚动的是区域
//                         oCitys = oProvince.citys[curentValue[1]];
//                         this.setData({
//                                 valueArr: curentValue
//                         })
//                 }
//                 this.setData({
//                         name: `${oProvince.name}--${oCitys.name}--${oCitys.areas[this.data.valueArr[2]]}`
//                 })
//         }
// })


var datas = {
    Dtype: [],  // 大类
    Xtype:[],   // 小类
    typeArr:[0,0],    // 默认值
    record:"",   // 存放数据
    typeName: "",   // 显示
    typeID:""   // 显示ID
};


Page({
    data:datas,
    onLoad:function(){  // 加载
        this.request();
    },
    request:function(){ // 请求的ajax
        var _this = this;
        wx.request({
            url: 'https://m.12348.com.cn/index.php/getCategorys?server=1', 
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (!res.data.status) return false;
                var res = res.data.data.categorys;
                 _this.setData({
                     record: res
                })
            }
        })
    },
    initFn:function(){ // 点击显示
        var _this = this;
        var record = _this.data.record;
        var center = record[this.data.typeArr[0]];
        var valArr = _this.data.typeArr;
     
        var Dtype = [];     // 存储的大类
        var Xtype = [];     // 存储的小类
        
        record.forEach(function(obj){
            Dtype.push(obj)
        })
        center.child.forEach(function(obj){
            Xtype.push(obj)
        })

        _this.setData({
            Dtype: Dtype,
            Xtype: Xtype,
            typeName: `${Dtype[valArr[0]].name}--${Xtype[valArr[1]].name}`,
            typeID: `${Dtype[valArr[0]].id}--${Xtype[valArr[1]].id}`
        })
        
    },
    change:function(e){ // 滚动获取值
        var _this = this;

        var record = _this.data.record;
        var valArr = _this.data.typeArr;
        var curentValue = e.detail.value;

        var Xtype = [];

        var prem = record[curentValue[0]];

        if (valArr[0]!= curentValue[0]){
            
            prem.child.forEach(function(obj){
                Xtype.push(obj);
            })
            _this.setData({
                Xtype: Xtype,
                typeArr: [curentValue[0],0]
            })
        }else{
            var datas = this.data.Xtype;
            this.setData({
                typeArr: curentValue
            })            
        }
       this.setData({
           typeName: `${prem.name}--${prem.child[curentValue[1]].name}`,
           typeID: `${prem.id}--${prem.child[curentValue[1]].id}`
       })
    }
})