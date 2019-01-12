import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/auth/authUser/list',
    method: 'get',
    params: query
  })
}

export function fetchOne(id) {
  return request({
    url: '/auth/authUser/detail/' + id,
    method: 'get'
  })
}

export function createOne(data) {
  return request({
    url: '/auth/authUser/create',
    method: 'post',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: '/auth/authUser/delete/' + id,
    method: 'delete'
  })
}

export function updateOne(data) {
  return request({
    url: '/auth/authUser/modify/' + data.id,
    method: 'put',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/auth/authUser/modify/' + data.id,
    method: 'put',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: '/auth/authUser/modify/' + data.id,
    method: 'put',
    data
  })
}

export function activeOne(data) {
  return request({
    url: '/auth/authUser/modify/' + data.id + '/active',
    method: 'put',
    data
  })
}
