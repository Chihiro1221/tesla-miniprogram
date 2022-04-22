// pages/activity/apply.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activity: null,
    last_name: '',
    first_name: '',
    email: '',
    mobile: NaN,
    remark: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.db = wx.cloud.database()
    this._loadActivity(options.id)
  },

  async _loadActivity(id) {
    const { data } = await this.db.collection('activity').doc(id).get()
    this.setData({
      activity: data,
    })
  },

  _validate() {
    const components = this.selectAllComponents('.tesla-input')
    return components.every((component) => !component.check() && !component._validateRules())
  },

  formSubmit() {
    wx.showLoading({
      title: '加载中',
    })
    if (!this._validate()) return wx.hideLoading()
    const { activity, ...data } = this.data
    this.db.collection('activity_apply').add({
      data: { ...data, activity: activity._id },
      success(res) {
        wx.hideLoading()
        wx.showModal({
          title: '申请成功',
          content: '感谢您提交活动申请。我们的工作人员会及时跟您电话联系',
          showCancel: false,
          success() {
            wx.navigateBack({
              delta: 1,
            })
          },
        })
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
