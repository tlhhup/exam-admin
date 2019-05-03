import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/question/Question/list',
    method: 'get',
    params: query
  })
}

export function fetchOne(id) {
  return request({
    url: '/question/Question/detail/' + id,
    method: 'get'
  })
}

export function createOne(data) {
  return request({
    url: '/question/Question/save',
    method: 'post',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: '/question/Question/delete/' + id,
    method: 'delete'
  })
}

export function updateOne(data) {
  return request({
    url: '/question/Question/update/',
    method: 'put',
    data
  })
}

export function activeOne(data) {
  return request({
    url: '/question/Question/active/' + data.id + '/' + data.active,
    method: 'put'
  })
}

