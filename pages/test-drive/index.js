// pages/test-drive/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    product: null,
    provinces: ["河北", "天津", "北京", "黑龙江"],
    cities: ["邢台", "沈阳", "深圳", "杭州"],
    province: 0,
    city: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ id } = {}) {
    this.db = wx.cloud.database();
    this.db
      .collection("product")
      .doc(id)
      .get()
      .then(async (res) => {
        this.setData({
          product: res.data,
        });
      });
  },

  formSubmit() {
    console.log(1);
  },
  bindProvincePickerChange(e) {
    this.setData({
      province: e.detail.value,
    });
  },
  bindCityPickerChange(e) {
    this.setData({
      city: e.detail.value,
    });
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
});
