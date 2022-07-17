### 聊天消息处理函数文件

1 首先需要定义主函数，可以叫main，也可以叫其他的名字
2 在主函数的参数中最少设置两个形参，分别为target，e
    target为消息对象，如果需要回复聊天，调用target.sendMsg()，并传入text参数，
    详细请浏览oicq第三方库: [oicq](https://github.com/takayama-lily/oicq)
    e作为消息实体，其中有许多属性:（只注释比较重要的属性）
    群消息类型：
~~~javascript 
  GroupMessage {
    post_type: 'message', 
    message_id: 'NAFVqEdbQbUABpN0aoLS+GLSnHIB',
    user_id: 1197162933,
    time: 1657969778, // 消息发送的时间（若要用js的Date对象转化，记得后面要再加3个0，js比正常时间戳多精确3位数）
    seq: 430964,
    rand: 1786958584,
    font: '微软雅黑',
    message: [ // 消息数组，如果消息由多个组成，会被切分，例如@和文字消息和图片，会被分为三个对象，type为他们的类型
      { type: 'at', qq: 3554691906, text: '@rabbit' },
      { type: 'text', text: ' 你好' }
    ],
    raw_message: '@rabbit 你麻痹', // 行消息，不同于message，将所有消息整合为一行字符串，不会显示图片及其他消息
    message_type: 'group', // 消息类型，group为群消息，private为私聊消息
    sender: { // 消息发送者的信息
      user_id: 000, // QQ号
      nickname: '昵称',
      card: '群名片',
      sex: '性别',
      age: 0,
      area: '地区',
      level: 2,
      role: 'admin', // 群内角色，admin就是管理员
      title: '至臻亚洲人'
    },
    group_id: 000, // 群号
    group_name: '暗影岛三批聚顶大本营', // 群名称
    block: false,
    sub_type: 'normal',
    anonymous: null,
    atme: true, // 是否为@机器人(boolean)
    atall: false,  //是否为@全体成员(boolean)
    group: Group {},
    member: Member {},
    reply: [Function (anonymous)],
    recall: [Function (anonymous)],
    self_id: 000  // 机器人qq号
  }
~~~
    私聊消息类型：（大多数属性同群消息一样，不做注释）
~~~javascript
  PrivateMessage {
    post_type: 'message',
    message_id: 'EFl6QQAAf8wMOqZmYtKa/gA=',
    user_id: 274299457,
    time: 1657969406,
    seq: 32716,
    rand: 205170278,
    font: '宋体',
    message: [ { type: 'text', text: '文字' } ],
    raw_message: '文字',
    message_type: 'private',
    sub_type: 'friend',
    sender: {
      user_id: 000,
      nickname: '昵称',
      group_id: undefined,
      discuss_id: undefined
    },
    from_id: 000, // 发送人的qq号
    to_id: 000,  // 接收人的qq号，也就是机器人的qq号
    auto_reply: false,
    friend: Friend {},
    reply: [Function (anonymous)], //用于回复的回调函数，一般不管他
    self_id: 000
  }
~~~
3 自己写消息检索操作和回复操作
4 使用 module.exports=函数名 将主函数，也就是1中的函数导出 (**!!!切记函数名后不可加括号!!!**)
5 在index.js中导入你的函数，并在answer函数中调用你的函数
6 要注意的是，主函数应该有返回值，为true/false，需要手动返回，true代表函数调用成功，也就是做了操作，false是不做操作，也就是此次调用你这个函数没有做任何操作，index.js中会根据函数的返回值决定是否继续调用其他消息处理函数，如果有函数返回了true，则后面的其他消息处理函数不会被调用，所以要注意书写先后顺序。(*如果不做任何返回值，函数默认返回undefined，和false等价)
**简单地说，在index.js文件中，消息处理函数具有执行顺序，以及调用唯一性**
Tips: 1 mods函数应该分为两部分，一是对消息的检索，而是做什么操作，具体自己琢磨
      2 ~~在群消息中，只有机器人被@才会触发聊天处理函数~~ 现在无论是否被@都会触发，请自行通过e.atme判断是否为@机器人



### 定时任务函数文件
1.定时任务函数和聊天处理函数一样，需要定义主函数。不同的是，定时任务函数只有两个参数，并且不允许自己新增第三个及更多的参数。
第一个参数和聊天处理函数一样，是target，是聊天对象，具体看聊天处理函数介绍。
第二个参数为date，是当前被调用时的时间，为js的Date()时间对象。tips:其实可以不用管这个参数，你可以在函数内部自己手动创建一个新的时间对象...
2.与消息处理函数一样，定时处理函数也需要把主函数导出！
3.与消息处理函数不同的是，定任务函数不需要返回值，也就是说，该类函数不具备先后顺序以及调用唯一性