// pages/video/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollWidth: '100%',
    products: [],
    currentProduct: 0,
    currentVideoCate: 0,
    videos: [],
    currentVideo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.query = wx.createSelectorQuery()
    this.db = wx.cloud.database()
    this._computedScrollWidth()
    this._loadProduct()
  },

  // 计算出滑动最大宽度
  _computedScrollWidth() {
    setTimeout(() => {
      this.query
        .selectAll('.nav-item')
        .boundingClientRect((rect) => {
          const count = rect.reduce((r, c) => {
            return (r += c.width + 44)
          }, 0)
          this.setData({
            scrollWidth: count + 'px',
          })
        })
        .exec()
    }, 1000)
  },

  // 获取产品
  _loadProduct() {
    wx.cloud.callFunction({
      name: 'getProduct',
      success: async (res) => {
        const { products } = res.result
        this.setData({
          products,
        })
        this._loadVideos()
      },
    })
  },

  // 获取当前分类的所有视频
  async _loadVideos() {
    const videos = await Promise.all(
      this.data.products[this.data.currentProduct].study_video[this.data.currentVideoCate].videos.map(async (video) => {
        const { data } = (await this._loadVideoByCate(video)) || {}
        return data
      })
    )
    this.setData({
      videos,
      currentVideo: videos && videos[0],
    })
  },

  // 获取教程分类下所有视频
  async _loadVideoByCate(video) {
    return await this.db.collection('video').doc(video).get()
  },

  bindPickerChange(e) {
    const { value } = e.detail
    this.setData({
      currentProduct: value,
    })
    this._loadVideos()
  },

  changeVideoCate(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      currentVideoCate: index,
    })
    this._loadVideos()
  },

  changeCurrentVideo(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      currentVideo: this.data.videos[index],
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
