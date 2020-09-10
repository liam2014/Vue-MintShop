/*
与后台交互模块 （依赖已封装的ajax函数）
 */
import {send, checkIsTokenOutTime, getRefreshToken} from './axios' // './ajax' //
import { getToken, saveTokens } from '../util/token'
const BASE_URL = 'http://localhost:4001'
// const BASE_URL = '/api'
const REFRESH_URL = BASE_URL + '/api_app/api/v1/user/refresh' // 刷新token 地址

// 发送数据
async function ajax (url = '', data = {}, type = 'GET') {
  let db = await send(url, data, type, getToken('access_token'))
  // 数据拦截:token 是否过期
  if (checkIsTokenOutTime(db)) {
    let ok = await getRefreshToken(REFRESH_URL, getToken('refresh_token')) // 刷新token
    console.log('refresh-token:', ok)
    if (ok && ok.code === 0) {
      saveTokens(ok.data.access_token, ok.data.refresh_token)
      db = await send(url, data, type, ok.data.access_token) // 重新取数据
    }
  }
  return db
}

/**
 * 获取地址信息(根据经纬度串)
 * 这个接口的经纬度参数是在url路径里的，没有query参数
 */
export const reqAddress = geohash => ajax(`${BASE_URL}/api_app/api/v1/shop/position?location=${geohash}`)
/**
 * 获取 msite 页面食品分类列表
 */
export const reqCategorys = () => ajax(BASE_URL + '/api_app/api/v1/shop/index-category')
/**
 * 获取 msite 商铺列表(根据query参数：经纬度)
 * 将经纬度两个数据作为一个参数对象传入
 * 也可以两个数据分别传入ajax， 然后再放入一个对象参数内， 如下面的手机号接口
 */
export const reqShops = ({latitude, longitude}) => ajax(BASE_URL + '/api_app/api/v1/shop/shops', {latitude, longitude})
/**
 * 根据经纬度和关键字搜索商铺列表
 */
export const reqSearchShop = (geohash, keyword) => ajax(BASE_URL + '/api_app/api/v1/shop/search-shops', {geohash, keyword})
/**
 * 账号密码登录
 */
export const reqPwdLogin = ({name, pwd, captcha}) => ajax(BASE_URL + '/api_app/api/v1/user/login-pwd', {username: name, password: pwd, client: 2, login_flag: 1}, 'POST')
/**
 * 获取短信验证码
 */
export const reqSendCode = phone => ajax(BASE_URL + '/api_app/api/v1/user/login-sms', {phone})
/**
 * 手机号验证码登录
 */
export const reqSmsLogin = (phone, code) => ajax(BASE_URL + '/api_app/api/v1/user/login-sms', {phone, code, client: 2, login_flag: 1}, 'POST')
/**
 * 获取用户信息(根据会话)
 */
export const reqUserInfo = () => ajax(BASE_URL + '/api_app/api/v1/user/info')
/**
 * 请求登出
 */
export const reqLogout = () => ajax(BASE_URL + '/api_app/api/v1/user/logout')
/**
 * 获取商家信息(下列请求由mock拦截并返回 不需要代理)
 */
export const reqShopInfo = () => ajax('/info')
/**
 * 获取商家评价数组
 */
export const reqShopRatings = () => ajax('/ratings')
/**
 * 获取商家商品数组
 */
export const reqShopGoods = () => ajax('/goods')
