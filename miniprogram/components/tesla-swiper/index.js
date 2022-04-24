// components/tesla-swiper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiperList: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 0,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    swiperChange(data) {
      const { current } = data.detail
      this.setData({
        current,
      })
    },
    gotoProduct() {
      const current = this.properties.swiperList[this.data.current]
      if (!current.product) return
      wx.navigateTo({
        url: `/subPackages/pages/product/index?id=${current.product}`,
      })
    },
    showBookDialog() {
      this.triggerEvent('show-book-dialog')
    },
  },
})
