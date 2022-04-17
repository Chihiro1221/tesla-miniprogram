// components/tesla-search-input/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      const { value } = e.detail
      this.triggerEvent('on-search', value)
    },
    clearValue() {
      this.triggerEvent('on-search', '')
    },
  },
})
