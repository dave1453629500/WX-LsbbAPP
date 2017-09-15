# 这是一个公司做的小程序，第一版；
这个小程序是一版与律师相关的微信小程序，里面涉及的功能能满足一些日常的开发需求，<br />
目前的流程基本能走通，大体的框架已经出来了<br />
pages\questions ：利用picker-view实现的三级城市联动、（pages\demo 是写的时候提供的思路，不太懂的可以看看）<br />
pages\login ： 利用setStorage存储的登陆信息，判断是否是登陆的状态<br />
pages\Consultation:上拉刷新，筛选刷新等<br />
pages\addimages:上传多张图片、记录信息等<br />

2017-9-17 <br />
map\mappos:更新了 地图定位的功能<br />

2017-9-12<br />
pages/Reply/Reply:更新了 回复的功能<br />
pages/static/... :更新了一些文本的静态内容<br /><br />
pages/setUp/setUp :更新了退出登陆，修改密码<br />

完善的BUG：<br />
    1、每次点击详情的时候 都会加载更多重复的数据<br />
    2、点击跳转回复的时候回到上一个页面不能刷新的问题<br />

2017-9-13<br />
pages/myListModify/myListModify:更新了个人信息的修改的功能<br />

完善的BUG：<br />
    1、注册完成之后直接跳转登陆页面记住账号密码

2017-9-15<br />
pages/myListStatic/order/order：更新了我的订单的查看的功能<br />

完成的BUG：<br />
    1、解决每次登陆时没有登录的信息
    