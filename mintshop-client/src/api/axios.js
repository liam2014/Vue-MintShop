/*
ajax 请求函数模块:通用性，拦截功能
*/
import axios from 'axios'

const REFRESH_URL = '/api/refresh' // 刷新token 地址

function post (url = '', data = {}, token) {
  const headToken = 'Bearer ' + token
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

function get (url = '', data = {}, token) {
  let dataStr = '' // 数据拼接字符串，将data连接到url
  Object.keys(data).forEach(key => {
    dataStr += key + '=' + data[key] + '&'
  })
  if (dataStr !== '') {
    dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
    url = url + '?' + dataStr
  }
  const headToken = 'Bearer ' + token
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

function checkIsTokenOutTime (data) {
  if (data === null || data === undefined) {
    return false
  }
  let flag = data.code
  if (flag && flag > 10040 && flag < 10049) {
    return true
  }
  return false
}

async function refreshToken (url) {
  let db = await get(url, {}, 'refresh-token-get')
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

async function axiosData (url = '', data = {}, type = 'GET') {
  let db
  if (type === 'GET') {
    db = await get(url, data, 'xxx-get')
  } else {
    db = await post(url, data, 'xxx-post')
  }
  return db
}

export default async function myAxios (url = '', data = {}, type = 'GET') {
  // 返回值 Promise对象 （异步返回的数据是response.data，而不是response）
  let db = await axiosData(url, data, type)
  // 数据拦截:token 是否过期
  if (checkIsTokenOutTime(db)) {
    let ok = refreshToken(REFRESH_URL) // 刷新token
    if (ok) {
      db = await axiosData(url, data, type) // 重新取数据
    }
  }
  return db
}
