// index.js
Page({
  data: {
    swiperList: [],
  },

  onLoad() {
    this._loadSwiper();
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
});
