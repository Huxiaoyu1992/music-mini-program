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
    ctx.body = await collection.skip(event.start).limit(event.count).orderBy('creatTime', 'desc').get().then(res => {
      return res.data
    })
  })
  return app.serve()
}