// 大屏相关api接口
import request from '/src/utils/request'

// 获取地图数据
export const getWorldMapData = () =>
  request({
    url: 'initData/homepage/getCurStatByCountry/true/11',
    method: 'get',
  })
// 获取设备部署地址
export const getCountryPosition = () =>
  request({ url: 'initData/network/getCountryPosition', method: 'get' })
// 获取攻击信息
export const getAttackInfo = () =>
  request({ url: 'api/v1/screen/attack_info', method: 'get' })
// 获取系统状态
export const getSystemStatus = () =>
  request({ url: 'api/v1/screen/system_status', method: 'get' })
// 获取实时告警数据
export const getRealtimeAlert = () =>
  request({ url: 'api/v1/screen/realtime_alert', method: 'get' })
// 获取十大攻击源数据
export const getTenSource = () =>
  request({ url: 'api/v1/screen/ten_source', method: 'get' })
// 获取十大攻击源数据
export const getTenType = () =>
  request({ url: 'api/v1/screen/ten_type', method: 'get' })
// 获取今日访问数据
export const getTodayAccess = () =>
  request({ url: 'api/v1/screen/today_access', method: 'get' })
