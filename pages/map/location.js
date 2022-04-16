// pages/map/location.js
const QQMapWX = require('../../libs/qq-map/index.js')
const qqmapsdk = new QQMapWX({
  key: 'AXLBZ-UU7E4-NDZUP-DODDO-7C6RV-YYFZZ',
})
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markerInfo: null,
    address: '',
    calculateDistance: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ id }) {
    this.db = wx.cloud.database(id)
    this._getMarkerById(id)
  },

  _getMarkerById(id) {
    this.db
      .collection('marker')
      .doc(id)
      .get()
      .then(({ data }) => {
        this.setData({
          markerInfo: data,
        })
        this._getClassification()
        this._getLocation()
        this._calculateDisdance()
      })
  },

  _getClassification() {
    const calssificationId = this.data.markerInfo.classification_id
    this.db
      .collection('marker_classification')
      .doc(calssificationId)
      .get()
      .then(({ data }) => {
        this.data.markerInfo.classification_id = data
        this.setData({
          markerInfo: this.data.markerInfo,
        })
      })
  },

  _calculateDisdance() {
    const {
      userLocation: {
        location: { lat: latitude, lng: longitude },
      },
    } = app.globalData
    qqmapsdk.calculateDistance({
      mode: 'driving',
      from: {
        latitude,
        longitude,
      },
      to: [
        {
          latitude: this.data.markerInfo.latitude,
          longitude: this.data.markerInfo.longitude,
        },
      ],
      success: ({ result: { elements } }) => {
        const { distance } = elements[0]
        this.setData({
          calculateDistance: (distance / 1000).toFixed(2) + ' km',
        })
      },
      fail(error) {
        wx.showToast({
          title: '计算距离失败',
        })
      },
    })
  },

  // 根据经纬度获取详细地址信息
  _getLocation() {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: this.data.markerInfo.latitude,
        longitude: this.data.markerInfo.longitude,
      },
      success: ({ result }) => {
        const {
          formatted_addresses: { recommend },
        } = result || {}
        this.setData({
          address: recommend,
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
