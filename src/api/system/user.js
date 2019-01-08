import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/authRole/list',
    method: 'get',
    params: query
  })
}

export function fetchUser(id) {
  return request({
    url: '/authRole/detail/' + id,
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/authRole/create',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/authRole/delete/' + id,
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    url: '/authRole/modify/' + data.id,
    method: 'put',
    data
  })
}
