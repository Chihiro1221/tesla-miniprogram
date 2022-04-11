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
      value: "",
    },
    value: {
      type: String,
      value: "",
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
    onInputChange() {
      this.check();
    },

    check() {
      if (this.properties.required) {
        const isError = this.data.value ? false : true;
        this.setData({
          isError,
        });
        return isError;
      }
      return false;
    },
  },
});
