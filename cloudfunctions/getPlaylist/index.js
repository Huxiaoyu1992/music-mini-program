// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const rp = require('request-promise')
const URL = 'http://musicapi.xiecheng.live/personalized'

const collection = db.collection('playlist')
// 云函数入口函数
exports.main = async (event, context) => {
  const list = await collection.get()
  const playlist = await rp(URL).then(res => {
    return JSON.parse(res).result
  })
  const newData = []
  for (let i = 0; i < playlist.length; i++) {
    await collection.add({
      data: {
        ...playlist[i],
        createTime: db.serverDate()
      }
    }).then(res => {
      console.log('插入成功')
    }).catch(e => {
      console.error('插入失败')
    })
  }
}