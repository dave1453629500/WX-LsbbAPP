



Page({
        data: {
                citysData:"", // 请求的数据
                province: "",  // 数组省
                city: "", // 数组市
                area:"", // 数组区
                valueArr:[0,0,0],  // 默认值
                name:"" // 赋值
        },
        initFn: function () {        // 初始化
                var aProvince = [];     // 存储省
                var citys = [];              //存储 市
                var areas = [];          //存储 区

                var citysData = this.data.citysData;
                var oProvince = citysData[this.data.valueArr[0]];
           
                citysData.forEach(function (province, i) {
                        aProvince.push(province.name);
                })
                oProvince.citys.forEach(function(res){
                        citys.push(res.name)
                })
                areas = oProvince.citys[this.data.valueArr[1]].areas;
                var pos = this.data.valueArr;
                this.setData({
                        province: aProvince,
                        city: citys,
                        area: areas,
                        name: `${aProvince[this.data.valueArr[0]]}--${citys[this.data.valueArr[1]]}--${areas[this.data.valueArr[2]]} `
                })
        },
        onLoad: function (options) {
                var _this = this;
                wx.request({
                        url: 'https://m.12348.com.cn/index.php/getAreas?server=1',
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
        bindChange: function (e) {
             
                var citysData = this.data.citysData;        // 获取到总数据
                var posValue = this.data.valueArr;          // 获取到默认值的array
                var  curentValue = e.detail.value;            // 获取到滚动的array
                var oProvince = {};     // 省份的数据
                var aCitys = [];         // 城市的数组list
                var oCitys = {};        // 城市的数据
                oProvince = citysData[curentValue[0]];          // 获取到省份
            
                if (posValue[0] != curentValue[0] ){    // 如果省份默认值与省份滚动值不相等，那么就是滚动的省份
                        oProvince.citys.forEach(function(data){ // 利用省份获取对应子集的市区数组
                                aCitys.push(data.name);
                        })
                        oCitys = oProvince.citys[0];    // 显示市区数组第一个
                        this.setData({
                                city: aCitys,   // 赋值对应市区数组
                                area: oCitys.areas,             // 区域数组
                                valueArr: [curentValue[0],0,0]  // 赋值第一个省份
                        })
                } else if (this.data.valueArr[1] != curentValue[1]){      // 以此判断市
                        if (curentValue[1] >= oProvince.citys.length) return ;  // 数据不存在
                        oCitys = oProvince.citys[curentValue[1]];
                       this.setData({
                               area: oCitys.areas,
                               valueArr: [curentValue[0], curentValue[1], 0]
                       })
                } else{  // 滚动的是区域
                        oCitys = oProvince.citys[curentValue[1]];
                        this.setData({
                                valueArr: curentValue
                        })
                }
                this.setData({
                        name: `${oProvince.name}--${oCitys.name}--${oCitys.areas[this.data.valueArr[2]]}`
                })
        }
})