// app.js
import {
  getCitiesAndProvinces,
  getCurrentUserLocation,
} from "./utils/location";
App({
  globalData: {},
  onLaunch() {
    wx.cloud.init();
    const userLocation = getCurrentUserLocation();
    const citiesAndProvinces = getCitiesAndProvinces();
    this.globalData = { ...citiesAndProvinces, userLocation };
  },
});
