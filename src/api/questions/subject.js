import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/question/Subject/list',
    method: 'get',
    params: query
  })
}

export function fetchAll() {
  return request({
    url: '/question/Subject/all',
    method: 'get'
  })
}

export function fetchOne(id) {
  return request({
    url: '/question/Subject/detail/' + id,
    method: 'get'
  })
}

export function createOne(data) {
  return request({
    url: '/question/Subject/create',
    method: 'post',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: '/question/Subject/delete/' + id,
    method: 'delete'
  })
}

export function updateOne(data) {
  return request({
    url: '/question/Subject/update/',
    method: 'put',
    data
  })
}

export function activeOne(data) {
  return request({
    url: '/question/Subject/active/' + data.id + '/' + data.active,
    method: 'put'
  })
}

