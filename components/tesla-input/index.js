// components/tesla-input/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    required: {
      type: Boolean,
      value: false,
    },
    label: {
      type: String,
      value: null,
    },
    value: {
      type: Number | String,
      value: null,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isError: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInputChange({ detail } = {}) {
      if (this.properties.required) {
        const { value } = detail || {};
        this.setData({
          isError: value ? false : true,
        });
      }
    },
  },
});
