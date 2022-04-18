// pages/map/index.js
const app = getApp()
// pages/map/location.js
const QQMapWX = require('../../libs/qq-map/index.js')
const qqmapsdk = new QQMapWX({
  key: 'AXLBZ-UU7E4-NDZUP-DODDO-7C6RV-YYFZZ',
})
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lat: null,
    lng: null,
    // 标识分类
    markerClassifications: null,
    // 原始标识数据
    originalMarkers: null,
    // 打包后的标识数据
    markers: null,
    // 搜索
    search: '',
    // 周边城市
    searchAddress: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.db = wx.cloud.database()
    this._intialLocation()
    this._getMarkerClassification()
  },

  // 点击标识点
  clickMarker(e) {
    const { markerId } = e.detail
    wx.navigateTo({
      url: `../map/location?id=${this.data.markers[markerId]._id}`,
    })
  },

  // 修改激活状态
  changeMarkerClassification(e) {
    const { id } = e.currentTarget.dataset
    const markerClassifications = this.data.markerClassifications
    const activeClassification = markerClassifications.find((c) => c._id === id)
    activeClassification.isActive = !activeClassification.isActive
    const markers = this._buildMarker(this._filterCurrentClassificationOfMarkers())
    // 在重新过滤之前先查看是否有搜索定位
    const searchLocation = this.data.markers.find((item) => item.id === 99999)
    markers.push(searchLocation)
    this.setData({
      markerClassifications,
      markers,
    })
  },

  // 过滤出当前坐标分类下的所有坐标
  _filterCurrentClassificationOfMarkers() {
    // 过滤出所有是激活状态的分类
    const actives = this.data.markerClassifications.filter((c) => c.isActive)
    // 将当前激活状态下的所有标识找出
    return this.data.originalMarkers.filter((marker) => {
      return actives.find((c) => c._id === marker.classification_id)
    })
  },

  // 获取所有标识
  _getMarkers() {
    this.db
      .collection('marker')
      .get()
      .then(({ data } = {}) => {
        this.setData({
          originalMarkers: data,
        })
        this.setData({
          markers: this._buildMarker(this._filterCurrentClassificationOfMarkers()),
        })
      })
  },
  // 打包坐标
  _buildMarker(markers) {
    return markers.map((m, index) => {
      return {
        id: index,
        _id: m._id,
        name: m.name,
        longitude: m.longitude,
        callout: { content: m.name, padding: 5 },
        latitude: m.latitude,
        width: 35,
        height: 35,
        iconPath: this._findMarkerOfClassification(m).icon_path,
      }
    })
  },

  // 查询标识匹配的分类
  _findMarkerOfClassification(marker) {
    return this.data.markerClassifications.find((c) => {
      return c._id === marker.classification_id
    })
  },

  // 获取标识分类
  _getMarkerClassification() {
    this.db
      .collection('marker_classification')
      .get()
      .then(({ data } = {}) => {
        data.forEach((item, index) => (item.isActive = index ? false : true))
        this.setData({
          markerClassifications: data,
        })
        this._getMarkers()
      })
  },

  // 初始化位置
  _intialLocation() {
    const {
      userLocation: { location },
    } = app.globalData || {}

    this.setData({
      ...location,
    })
  },

  // 跳转到默认位置
  moveIntialLocation() {
    this._mapContext.moveToLocation()
    this._clearSearchMarker()
  },

  // 搜索
  onSearch({ detail }) {
    this.setData({
      search: detail,
    })
    qqmapsdk.getSuggestion({
      keyword: detail,
      page_size: 20,
      success: ({ data }) => {
        this.setData({
          searchAddress: data,
        })
      },
    })
  },

  // 跳转到指定位置
  moveToLocation(e) {
    const {
      location: { lat: latitude, lng: longitude },
    } = e.currentTarget.dataset
    this._clearSearchMarker()
    this.data.markers.push({
      id: 99999,
      latitude,
      longitude,
      height: 35,
      width: 35,
      iconPath: '../../images/Pin.png',
    })
    this.setData({
      search: '',
      markers: this.data.markers,
    })
    // Todo:有的时候跳转不生效
    this._mapContext.moveToLocation({
      latitude,
      longitude,
    })
  },

  // 清除搜索图标
  _clearSearchMarker() {
    const index = this.data.markers.findIndex((item) => item.id === 99999)
    if (index === -1) return
    this.data.markers.splice(index, 1)
    this.setData({
      markers: this.data.markers,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this._mapContext = wx.createMapContext('mapId')
    this._mapContext.moveToLocation()
  },

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
