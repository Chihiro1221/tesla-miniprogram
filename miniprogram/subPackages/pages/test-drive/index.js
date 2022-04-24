const app = getApp()
import { buildProvincesToTree } from '../../../utils/location'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    product: null,
    provinceTree: null,
    province: 0,
    city: 0,
    lastName: '',
    firstName: '',
    email: '',
    mobile: '',
    isChecked: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ id } = {}) {
    this.db = wx.cloud.database()
    this._loadProduct(id)
    this._loadProvinceAndCity()
  },

  async formSubmit() {
    if (!this._validate()) return
    wx.showLoading({
      title: '加载中',
    })
    this._handleSubmit()
  },

  async _handleSubmit() {
    const { product, provinceTree, province, city, ...data } = this.data
    data.province = provinceTree[province].fullname
    data.city = provinceTree[province]['children'][city].fullname
    data.product = this.data.product._id
    const res = await this.db.collection('test-drive').add({
      data,
    })
    if (res) {
      wx.hideLoading()
      wx.showModal({
        title: '预约成功',
        content: '感谢您提交Tesla试驾请求。我们的工作人员会及时跟您电话联系',
        showCancel: false,
        success() {
          wx.navigateBack({
            delta: 1,
          })
        },
      })
    }
  },

  _validate() {
    const components = this.selectAllComponents('.tesla-input')
    return components.every((component) => !component.check() && !component._validateRules())
  },

  _loadProduct(id) {
    this.db = wx.cloud.database()
    this.db
      .collection('product')
      .doc(id)
      .get()
      .then(async (res) => {
        this.setData({
          product: res.data,
        })
      })
  },

  _loadProvinceAndCity() {
    const { province, city } = app.globalData.userLocation
    const provinceTree = buildProvincesToTree()
    const currentProvince = provinceTree.findIndex((pro) => pro.fullname === province)
    const currentCity = provinceTree[currentProvince].children.findIndex((c) => c.fullname === city)
    this.setData({
      province: currentProvince,
      city: currentCity,
      provinceTree,
    })
  },

  bindProvincePickerChange(e) {
    this.setData({
      province: e.detail.value,
      city: 0,
    })
  },

  bindCityPickerChange(e) {
    this.setData({
      city: e.detail.value,
    })
  },

  checkboxChange() {
    this.setData({ isChecked: !this.data.isChecked })
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
