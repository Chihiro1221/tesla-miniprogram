const dayjs = require('dayjs')

// pages/discovery/category.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    category: null,
    articles: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.db = wx.cloud.database()
    this._loadCategory(options.id)
  },

  _loadCategory(id) {
    this.db
      .collection('article_cate')
      .doc(id)
      .get()
      .then(({ data }) => {
        this.setData({
          category: data,
        })
        this._loadArticleByCate(id)
      })
  },

  _loadArticleByCate(id) {
    this.db
      .collection('article')
      .where({ category: id })
      .get()
      .then(({ data }) => {
        data.forEach((item) => {
          item.created_time = dayjs(item.created_time).format('YYYY-MM-DD')
        })
        this.setData({
          articles: data,
        })
      })
  },

  gotoDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `./detail?id=${id}`,
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
