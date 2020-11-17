// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const BASE_URL = 'http://www.xiecheng.live'
cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({ event })
  // 获取首页推荐音乐
  app.router('playlist', async(ctx, next) => {
    ctx.body =  await cloud.database().collection('playlist')
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime', 'desc')
    .get()
    .then(res => {
      return res
    })
  })
  // 获取某推荐歌单的列表
  app.router('musiclist', async(ctx, next) => {
    ctx.body = await rp(`${BASE_URL}/playlist/detail?id=${parseInt(event.playlistId)}`)
    .then(res => {
      return JSON.parse(res)
    })
  })

  // 获取当前音乐播放地址
  app.router('musicUrl', async(ctx, next) => {
    ctx.body = await rp(`${BASE_URL}/song/url?id=${parseInt(event.musicId)}`)
    .then(res => {
      return JSON.parse(res)
    })
  })

  // 获取歌词
  app.router('lyric', async(ctx, next) => {
    ctx.body = await rp(`${BASE_URL}/lyric?id=${event.id}`).then(res => {
      return res
    })
  })
  return app.serve()

}