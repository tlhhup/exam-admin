import request from '@/utils/request'

export function loginByUsername(userName, password, userType) {
  const data = {
    userName,
    password,
    userType
  }
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/auth/user/info',
    method: 'get'
  })
}

