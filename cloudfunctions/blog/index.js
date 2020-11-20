// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const TcbRouter = require('tcb-router')
const db = cloud.database()
const collection = db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('list', async(ctx, next) => {
    const keyword = event.keyword.trim()
    let w = {}
    if (keyword) {
      w = {
        content: db.RegExp({
          regexp: keyword,
          options: 'i' // i 忽略大小写 m 跨行匹配 等
        })
      }
    }
    ctx.body = await collection.where(w).skip(event.start).limit(event.count).orderBy('creatTime', 'desc').get().then(res => {
      return res.data
    })
  })
  return app.serve()
}