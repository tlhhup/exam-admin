import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/auth/authPermission/list',
    method: 'get'
  })
}

export function fetchMenu(id) {
  return request({
    url: '/auth/authPermission/detail/' + id,
    method: 'get'
  })
}

export function createMenu(data) {
  return request({
    url: '/auth/authPermission/create',
    method: 'post',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: '/auth/authPermission/delete/' + id,
    method: 'delete'
  })
}

export function updateMenu(data) {
  return request({
    url: '/auth/authPermission/modify/' + data.id,
    method: 'put',
    data
  })
}
