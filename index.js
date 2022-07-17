/**
 * author: rabbit
 * date: 2022-7-16
 * name: 基于nodejs和oicq的qq机器人脚本
 * License: MIT
 * version: 1.1.0
 */

const oicq = require('oicq')
const crypto = require('crypto')
const defaultConfig = require('./config.json')

// 导入mods


// 托管的QQ号配置
const {
  uin,
  pwd
} = defaultConfig.account
// 全局计时器
let timer = void(0)

const password_md5 = crypto.createHash('md5').update(pwd).digest('hex')
const config = {
  platform: 1, //登陆类型 1手机 2平板 3手表(不支持部分群事件)
  log_level: "info", //日志级别，有trace,debug,info,warn,error,fatal,off
  kickoff: true, //被挤下线是否在3秒后反挤对方
  ignore_self: true, //群聊是否无视自己的发言
}
const client = oicq.createClient(uin, config);

client.on("system.login.slider", function(e) {
  console.log("输入ticket：")
  process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
}).login(password_md5)
client.on("system.login.device", function(e) {
  if(e.url!='') {
    console.log('请选择验证方式，输入 0(url验证) / 1(短信验证)')
    process.stdin.once("data", c => {
      if(String(c).trim()==0) {
        console.log('点击url验证', e.url)
      }else if(String(c).trim()==1) {
        this.sendSmsCode()
        console.log('输入验证码')
        process.stdin.once("data", code => this.submitSmsCode(String(code).trim()))
      }
    })
  }
}).login(password_md5)



// 登录成功回调
client.on("system.online", e => {
  console.log('\n登录成功\n');
  timerFunc()
});

// 获取群消息
client.on("message.group", e => {
  // console.log(e)
  try {
    answer(e, 'group')
  }catch(err){console.log(err);}
})
// 获取私聊消息
client.on("message.private", e => {
  // console.log(e)
  try {
    answer(e, 'private')
  }catch{}
})

function answer(e, type) {
  // target是消息对象，type是消息类型，只有群('group')和私聊('private')消息。
  // 原则上所有回复函数都应该接受这个target对象，使用target对象内置的sendMsg()函数发送回复消息
  // 也可以使用oicq的全局变量函数去发送，不过需要传入群/用户的id，比较麻烦，所以建议直接在target对象上调用回复
  // 此外，回复函数为了检索内容，还应该接受e参数，获取消息本身
  // e参数具体内容参考mods文件夹中的readme
  let target
  if(type == 'group') target = client.pickGroup(e.group_id)
  else if(type == 'private') target = client.pickFriend(e.user_id)

  /**
   * 确保在上方导入了你的mod，在这里调用你的mod函数，按以下格式调用
   * if(函数名(target, e)) return
   * 如果你不想在上面导入你的库，可以直接在这导入，这样写懒加载，导入后直接调用
   * if(require('./mods/name')(target, e)) return
   */
  // ================================== code here... ==================================


  

  // ================================== code end... ===================================
}


function timerFunc() {
  timer = setInterval(async () => {
    
    /**
     * 此处加入定时回调函数，计时器每分钟回调一次，回调函数为异步函数，使用以下方式调用
     * senderObj为发送对象：{
     *    id: 群号/qq号,
     *    type: 对象类型，'group'群消息，'private'私聊消息，类型对应各自id
     * }
     * func为回调函数，该函数由自己定义，用于做机器人操作，需要接收两个形参：
     *    target：发送对象，具体对象方法请参考oicq官方文档 (https://github.com/takayama-lily/oicq)
     *    date：js的Date()时间对象，为当前调用时互联网标准时间，需要自己调用内部函数获取具体时间值 (XD当然，你可以不管这个参数，直接在函数中调用Date()获取)
     * 需要注意，这个是回调函数，所以函数名后面不需要写括号！！！重点！如果你对js回调函数熟悉的话就能够理解，不熟悉就照做就完了
     * 
     * timerAction(senderObj, func)
     * 
     * 例如：
     *    timerAction({id: 123456, type: 'private'}, (target, date) => {
     *      if(date.getHours()==22 && date.getMinutes()==0) {
     *        target.sendMsg('晚安')
     *      }
     *    })
     * 以上为在每天晚上10点整时，向qq号为123456的用户发送“晚安”字符串
     * 
     * 当然，我建议回调函数写在mods中，这里的调用形式为：
     *    timerAction({id: 123456, type: 'private'}, sendGoodNight)
     * 并且在上方导入mods中的函数，或者写为第二种方式：
     *    timerAction({id: 123456, type: 'private'}, require("./mods/sendGoodNight"))
     * 第二种方式无需在上方导入，直接在此处使用时导入
     */

    // ================================== code here... ==================================
      


    
    // ================================== code end... ===================================

  }, 1000*60);
  const timerAction = (senderObj, func) => {
    if(typeof senderObj !== 'object' || Array.isArray(senderObj)) return false
    try {
      let target
      if(senderObj.type == 'group') target = client.pickGroup(senderObj.id)
      else if(senderObj.type == 'private') target = client.pickFriend(senderObj.id)
      func(target, new Date())
    }catch{}
  }
}
