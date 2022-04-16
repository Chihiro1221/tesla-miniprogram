// pages/map/index.js
const app = getApp()
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
    this.setData({
      markerClassifications,
      markers: this._buildMarker(this._filterCurrentClassificationOfMarkers()),
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

  moveIntialLocation() {
    this._mapContext.moveToLocation()
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
