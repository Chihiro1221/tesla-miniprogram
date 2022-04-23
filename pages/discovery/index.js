const dayjs = require('dayjs')

// pages/discovery/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    articles: [],
    articleCategories: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.db = wx.cloud.database()
    this._loadArticles()
    this._loadArticleCategories()
  },

  _loadArticles() {
    this.db
      .collection('article')
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

  _loadArticleCategories() {
    this.db
      .collection('article_cate')
      .get()
      .then(({ data }) => {
        this.setData({
          articleCategories: data,
        })
      })
  },

  gotoDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `./detail?id=${id}`,
    })
  },

  gotoCate(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `./category?id=${id}`,
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
