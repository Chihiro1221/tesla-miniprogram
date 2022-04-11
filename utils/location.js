const QQMapWX = require("../libs/qq-map/index.js");
const qqmapsdk = new QQMapWX({
  key: "AXLBZ-UU7E4-NDZUP-DODDO-7C6RV-YYFZZ",
});
export const initCurrentLocation = () => {
  qqmapsdk.reverseGeocoder({
    success: function (res) {
      wx.setStorageSync("userCurrentLocation", res.result.ad_info);
    },
  });
};

export const initCitiesAndProvinces = () => {
  qqmapsdk.getCityList({
    success: function (res) {
      wx.setStorageSync("provinces", res.result[0]);
      wx.setStorageSync("cities", res.result[1]);
    },
  });
};

export const getCitiesAndProvinces = () => {
  const provinces = wx.getStorageSync("provinces");
  const cities = wx.getStorageSync("cities");
  if (!provinces || !cities) initCitiesAndProvinces();
  return { provinces, cities };
};

export const getCurrentUserLocation = () => {
  const currentUserLocation = wx.getStorageSync("userCurrentLocation");
  if (!currentUserLocation) initCurrentLocation();
  return currentUserLocation;
};

export const buildProvincesToTree = () => {
  const app = getApp();
  const { cities, provinces } = app.globalData;
  const citiesGroup = [];
  let prevCityIndex = 0;
  let index = 0;
  cities.forEach((city, i) => {
    if (city.id.slice(0, 2) === cities[prevCityIndex].id.slice(0, 2)) {
      if (!citiesGroup[index]) citiesGroup[index] = [];
      citiesGroup[index].push(city);
    } else {
      prevCityIndex = i;
      index++;
    }
  });
  provinces.forEach(
    (province, index) => (province.children = citiesGroup[index])
  );

  return provinces;
};
