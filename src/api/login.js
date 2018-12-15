import request from '@/utils/request'

export function loginByUsername(userName, password, userType) {
  const data = {
    userName,
    password,
    userType
  }
  return request({
    url: '/auth/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/auth/auth/user/info',
    method: 'get'
  })
}

