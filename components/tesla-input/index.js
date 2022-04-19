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
      value: '',
    },
    value: {
      type: String,
      value: '',
    },
    rules: {
      type: Array,
      value: [],
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    picker: {
      type: Boolean,
      value: false,
    },
    disabledClass: {
      type: Boolean,
      value: false,
    },
    tip: {
      type: String,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isError: false,
    errorMessage: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInputChange() {
      this.check()
      this._validateRules()
    },

    check() {
      if (this.properties.required) {
        const isError = this.data.value ? false : true
        this.setData({
          isError,
          errorMessage: isError ? `请填写${this.properties.label || '必要字段'} ` : '',
        })
        return isError
      }
      return false
    },

    _validateRules() {
      let isError
      this.properties.rules.forEach((rule) => {
        switch (rule.type) {
          case 'email':
            isError = this._validateEmail()
            break
          case 'mobile':
            isError = this._validateMobile()
            break
          default:
            isError = false
        }
      })
      return isError
    },

    _validateEmail() {
      const regex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      const isError = regex.test(this.properties.value) ? false : true
      this.setData({
        isError,
        errorMessage: isError ? `邮箱格式不正确` : '',
      })
      return isError
    },
    _validateMobile() {
      const regex = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
      const isError = regex.test(this.properties.value) ? false : true
      this.setData({
        isError,
        errorMessage: isError ? `电话号码格式不正确` : '',
      })
      return isError
    },
  },
})
