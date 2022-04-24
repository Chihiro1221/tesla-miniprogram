const dayjs = require('dayjs')

// pages/activity/detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    applyStatus: false,
    isOvertime: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.db = wx.cloud.database()
    this._loadActivityDetail(options.id)
  },

  _loadActivityDetail(id) {
    this.db
      .collection('activity')
      .doc(id)
      .get()
      .then(({ data }) => {
        const isOvertime = Date.now() > data.end_time.valueOf()
        data.start_time = dayjs(data.start_time).format('MM月DD日 hh:mm')
        data.end_time = dayjs(data.end_time).format('MM月DD日 hh:mm')
        this.setData({
          detail: data,
          isOvertime,
        })
        wx.setNavigationBarTitle({
          title: data.name,
        })
        this._getApplyStatus()
      })
  },

  apply() {
    wx.navigateTo({
      url: `./apply?id=${this.data.detail._id}`,
    })
  },

  async _getApplyStatus() {
    const { data } = await this.db.collection('activity_apply').where({ activity: this.data.detail._id }).get()
    if (data.length) {
      this.setData({
        applyStatus: true,
      })
    }
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
