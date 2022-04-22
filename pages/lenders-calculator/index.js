// pages/lenders-calculator/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    calculateBox: false,
    products: null,
    productLines: null,
    loans: ['合作机构贷款', '第三方机构贷款'],
    finances: ['标准贷款', '审批贷款'],
    deadlines: ['6期', '12期'],
    currentProduct: 0,
    currentProductLine: 0,
    currentLoans: 0,
    currentFinance: 0,
    currentDeadline: 0,
    payment: 15,
    annualizedRate: '4.00',
    boardType: ['个人', '企业'],
    currentBoard: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.db = wx.cloud.database()
    this._loadProduct()
  },

  _loadProduct() {
    this.db
      .collection('product')
      .get()
      .then(({ data }) => {
        this.setData({
          products: data,
        })
        this._loadProductLine()
      })
  },
  // 获取对应产品的产品线
  _loadProductLine() {
    this.db
      .collection('product_line')
      .where({
        _id: {
          $in: this.data.products[this.data.currentProduct].product_lines,
        },
      })
      .get()
      .then(({ data }) => {
        this.setData({
          productLines: data,
        })
      })
  },

  bindPickerProductChange(e) {
    const { value } = e.detail
    this.setData({
      currentProduct: value,
      currentProductLine: 0,
    })
    this._loadProductLine()
  },

  bindPickerProductLineChange(e) {
    const { value } = e.detail
    this.setData({
      currentProductLine: value,
    })
  },

  changeLoans(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      currentLoans: index,
    })
  },

  bindPickerFinanceChange(e) {
    const { value } = e.detail
    this.setData({
      currentFinance: value,
    })
  },

  bindPickerDeadlineChange(e) {
    const { value } = e.detail
    this.setData({
      currentDeadline: value,
    })
  },

  bindPickerBoardTypeChange(e) {
    const { value } = e.detail
    this.setData({
      currentBoard: value,
    })
  },

  changeCalculateBoxStatus() {
    this.setData({
      calculateBox: !this.data.calculateBox,
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
