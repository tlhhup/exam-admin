import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/auth/authRole/list',
    method: 'get',
    params: query
  })
}

export function fetchRole(id) {
  return request({
    url: '/auth/authRole/detail/' + id,
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/auth/authRole/create',
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/auth/authRole/delete/' + id,
    method: 'delete'
  })
}

export function updateRole(data) {
  return request({
    url: '/auth/authRole/modify/' + data.id,
    method: 'put',
    data
  })
}
