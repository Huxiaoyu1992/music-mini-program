// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // 消息推送
  const wxContext = cloud.getWXContext()
  await cloud.openapi.uniformMessage.send({
    touser: wxContext.OPENID,
    templateId: 'q5ECYzzvhBbE_kKikwidy52aJV-fM4g21w1Cp1A037g',
    page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    miniprogramState: 'developer',
    data: {
      phrase2: {
        value: '评论完成'
      },
      thing3:{
        value: event.content
      }
    },
    formId:event.formId
  })
  return 'success'
}