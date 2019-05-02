import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/question/QuestionTag/list',
    method: 'get',
    params: query
  })
}

export function fetchOne(id) {
  return request({
    url: '/question/QuestionTag/detail/' + id,
    method: 'get'
  })
}

export function createOne(data) {
  return request({
    url: '/question/QuestionTag/save',
    method: 'post',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: '/question/QuestionTag/delete/' + id,
    method: 'delete'
  })
}

export function updateOne(data) {
  return request({
    url: '/question/QuestionTag/update/',
    method: 'put',
    data
  })
}

export function activeOne(data) {
  return request({
    url: '/question/QuestionTag/active/' + data.id + '/' + data.active,
    method: 'put'
  })
}

