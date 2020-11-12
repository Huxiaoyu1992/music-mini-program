// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-2gbl69plc73c58ea',
  traceUser: true
})

const db = cloud.database()
const rp = require('request-promise')
const URL = 'http://www.xiecheng.live/personalized'
// const URL = 'http://m.kugou.com/rank/list&json=true'
const collection = db.collection('playlist')
// 从服务端云函数获取 一次只能获取100条数据，从小程序端获取 一次只能获取20条数据
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取数据库当中的数据
  // const list = await collection.get() // 这样写 一次只能拿到100条数据
  const totalCountResult = await collection.count()
  const total = totalCountResult.total
  const times = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  let list = {
    data: []
  }
  for (let i = 0; i < times.length; i++) {
    let promise = collection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 需要分批请求数据时
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((pre, cur) => {
      return {
        data: pre.data.concat(cur.data) // 字符串拼接
      }
    })
  }

  // 获取云函数中请求的数据
  const playlist = await rp(URL).then(res => {
    console.log(res)
    return JSON.parse(res).result || []
  })
  // 将数据库中的数据和请求到的数据作对比，请求到的数据在数据库中不存在再插入。
  const newData = []
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true
    for(let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id === list[data][j].id) {
        flag = false
        break // 跳出当前最内层的循环
      }
    }
    if (flag) {
      newData.push(playlist[i])
    }
  }
  // 将去重后的数据 添加到数据库中
  for (let i = 0; i < newData.length; i++) {
    await collection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate()
      }
    }).then(res => {
      console.log('插入成功')
    }).catch(e => {
      console.error('插入失败')
    })
  }
  return newData.length
}