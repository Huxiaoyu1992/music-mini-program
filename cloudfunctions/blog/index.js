// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const MAX_LIMIT = 100

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
    ctx.body = await collection.where(w).skip(event.start).limit(event.count).orderBy('createTime', 'desc').get().then(res => {
      return res.data
    })
  })

  // 获取博客详情
  app.router('detail', async (ctx, next) => {
    let blogId = event.blogId
    let detail = {}
    detail = await collection.where({
      _id: blogId
    }).get().then(res => {
      return res.data
    })
    // 查询评论
    const countResult = await collection.count()
    const total = countResult.total
    let commentList = {
      data: []
    }

    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = []
      for (let i = 0; i<batchTimes; i++) {
        let promise = db.collection('blog-comment').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
          blogId
        }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }

      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }

      ctx.body = {
        commentList, detail
      }
    }

  })

  const openid = cloud.getWXContext().OPENID
  // 获取我的发现列表
  app.router('getList', async (ctx, next) => {
    ctx.body = await collection.where({
      _openid: openid
    }).skip(event.start).limit(event.count).orderBy('createTime', 'desc').get().then(res => {
      return res.data
    })
  })
  return app.serve()
}