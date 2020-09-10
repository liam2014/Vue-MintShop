/*
ajax 请求函数模块:通用性，拦截功能
*/
import axios from 'axios'

export function post (url = '', data = {}, token) {
  const headToken = token
  return new Promise(function (resolve, reject) {
    let promise = axios({
      method: 'post',
      url: url,
      data: data,
      timeout: 10000,
      responseType: 'application/json',
      headers: { 'Authorization': headToken }
    })
    promise.then(response => {
      // 成功回调resolve()
      resolve(response.data)
    })
      .catch(error => {
        // 失败回调reject()
        reject(error)
      })
  })
}

export function get (url = '', data = {}, token) {
  let dataStr = '' // 数据拼接字符串，将data连接到url
  Object.keys(data).forEach(key => {
    dataStr += key + '=' + data[key] + '&'
  })
  if (dataStr !== '') {
    dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
    url = url + '?' + dataStr
  }
  const headToken = token
  return new Promise(function (resolve, reject) {
    let promise = axios({
      method: 'get',
      url: url,
      data: data,
      timeout: 10000,
      responseType: 'application/json',
      // headers: { 'Authorization': 'Bearer test-----get222 ' }
      headers: { 'Authorization': headToken }
    })
    promise.then(response => {
      // 成功回调resolve()
      resolve(response.data)
    })
      .catch(error => {
        // 失败回调reject()
        reject(error)
      })
  })
}

export function checkIsTokenOutTime (data) {
  if (data === null || data === undefined) {
    return false
  }
  let flag = data.code
  if (flag && flag >= 10040 && flag <= 10049) {
    return true
  }
  return false
}

export async function refreshToken (url, refreshToken) {
  let db = await get(url, {}, refreshToken)
  try {
    let flag = db.code
    if (flag === 0) {
      return true
    }
  } catch (e) {
    return false
  }
  return false
}

export async function send (url = '', data = {}, type = 'GET', token) {
  let db
  if (type === 'GET') {
    db = await get(url, data, token)
  } else {
    db = await post(url, data, token)
  }
  return db
}

/*
const REFRESH_URL = '/api/refresh' // 刷新token 地址

export default async function myAxios (url = '', data = {}, type = 'GET') {
  // 返回值 Promise对象 （异步返回的数据是response.data，而不是response）
  let db = await send(url, data, type, 'token -from localStore')
  // 数据拦截:token 是否过期
  if (checkIsTokenOutTime(db)) {
    let ok = refreshToken(REFRESH_URL, 'get refreshToken') // 刷新token
    if (ok) {
      db = await send(url, data, type, 'token -from localStore') // 重新取数据
    }
  }
  return db
}
*/
