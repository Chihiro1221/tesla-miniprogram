// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database() //注意，不是wx.cloud.database()，这种是小程序端操作数据库的写法。云端没有“wx.”
const $ = db.command.aggregate
exports.main = async (event, context) => {
  const res = await db
    .collection('product')
    .aggregate()
    .lookup({
      from: 'video_cate',
      localField: 'study_video',
      foreignField: '_id',
      as: 'study_video',
    })
    .end()
  return { products: res.list }
}
