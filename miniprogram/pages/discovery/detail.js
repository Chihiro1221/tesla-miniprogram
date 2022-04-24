const dayjs = require('dayjs')

// pages/discovery/detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    article: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.db = wx.cloud.database()
    this._increaseBrowse(options.id)
  },

  _loadArticle(id) {
    this.db
      .collection('article')
      .doc(id)
      .get()
      .then(({ data }) => {
        data.created_time = dayjs(data.created_time).format('YYYY-MM-DD hh:mm')
        this.setData({
          article: data,
        })
      })
  },

  _increaseBrowse(id) {
    const _ = this.db.command
    this.db
      .collection('article')
      .doc(id)
      .update({
        data: {
          browse: _.inc(1),
        },
        success: () => {
          this._loadArticle(id)
        },
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
