// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
        scene: cloud.getWXContext().OPENID, // 小程序分销，可以放openID
        // page: 'pages/' // 这个值不配置是默认进首页
      })
    const upload = await cloud.uploadFile({
      cloudPath: `qrcode/=${Date.now()}-${Math.random()}-.png`,
      fileContent: result.buffer
    })
    return upload.fileID
  } catch (err) {
    return err
  }
}