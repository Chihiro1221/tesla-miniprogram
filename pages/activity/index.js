// pages/activity/index.js
const key = 'AXLBZ-UU7E4-NDZUP-DODDO-7C6RV-YYFZZ' // 使用在腾讯位置服务申请的key
const referer = '特斯拉' // 调用插件的app的名称
const citySelector = requirePlugin('citySelector')
const app = getApp()
var dayjs = require('dayjs')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentSwiper: 0,
    city: '全国',
    swiperActivity: null,
    activities: null,
    isLoading: false,
    currentPage: 0,
    page: 3,
    isDone: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.db = wx.cloud.database()
    this.setData({
      isLoading: true,
    })
    this._initCurrentCity()
    this._loadSwiperActivity()
    this.setData({
      activities: await this._loadActivity(),
    })
  },

  _initCurrentCity() {
    const {
      userLocation: { city },
    } = app.globalData
    this.setData({
      city,
    })
  },

  _loadSwiperActivity() {
    this.db
      .collection('activity')
      .where({ city: this.data.city, recommend: true })
      .get()
      .then(({ data }) => {
        this.setData({
          swiperActivity: data,
        })
      })
  },

  async _loadActivity() {
    const { data } = await this.db
      .collection('activity')
      .where({ city: this.data.city, recommend: false })
      .orderBy('created_time', 'desc')
      .limit(this.data.page)
      .skip(this.data.currentPage * this.data.page)
      .get()
    data.forEach((item) => {
      item.status = Date.now() > item.end_time.valueOf() ? 'applying_end' : 'applying_start'
      this.db
        .collection('activity_apply')
        .where({ activity: item._id })
        .get()
        .then(({ data }) => {
          item.status = data.length ? 'applied' : item.status
        })
      item.start_time = dayjs(item.start_time).format('MM月DD日')
      item.end_time = dayjs(item.end_time).format('MM月DD日')
    })
    this.setData({
      isLoading: false,
    })
    return data
  },

  swiperChange(e) {
    const { current } = e.detail
    this.setData({
      currentSwiper: current,
    })
  },

  switchCity() {
    wx.navigateTo({
      url: `plugin://citySelector/index?key=${key}&referer=${referer}`,
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
  onShow: async function () {
    const selectedCity = citySelector.getCity() // 选择城市后返回城市信息对象，若未选择返回null
    if (selectedCity) {
      this.setData({
        city: selectedCity.fullname,
      })
      this._loadSwiperActivity()
      this.setData({
        currentPage: 0,
        activities: await this._loadActivity(),
        page: 3,
        isDone: false,
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    citySelector.clearCity()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    this.setData({
      isLoading: true,
      currentPage: ++this.data.currentPage,
    })
    const activities = await this._loadActivity()
    const isDone = activities.length ? false : true
    this.setData({
      activities: this.data.activities.concat(activities),
      isDone,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
