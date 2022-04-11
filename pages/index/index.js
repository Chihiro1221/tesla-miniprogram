// index.js
Page({
  data: {
    swiperList: [],
    products: [],
    bookDialogVisible: false,
  },

  onLoad() {
    this._loadSwiper();
    this._loadProduct();
  },

  _loadProduct() {
    this.db
      .collection("product")
      .get()
      .then((res) => {
        this.setData({
          products: res.data,
        });
      });
  },

  _loadSwiper() {
    this.db = wx.cloud.database();
    this.db
      .collection("swiper")
      .get()
      .then((res) => {
        res.data.forEach((item) => {
          item.config = item.config.map((citem) => {
            const arr = citem.split("|");
            return { title: arr[0], subtitle: arr[1] };
          });
        });
        this.setData({
          swiperList: res.data,
        });
      });
  },
  showBookDialog() {
    this.setData({
      bookDialogVisible: true,
    });
  },
  closeBookDialog() {
    this.setData({
      bookDialogVisible: false,
    });
  },
  gotoProduct(e) {
    const { id } = e.target.dataset || {};
    wx.navigateTo({
      url: `/pages/test-drive/index?id=${id}`,
    });
    this.setData({ bookDialogVisible: false });
  },
});
