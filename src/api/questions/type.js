import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/question/QuestionType/list',
    method: 'get',
    params: query
  })
}

export function fetchOne(id) {
  return request({
    url: '/question/QuestionType/detail/' + id,
    method: 'get'
  })
}

export function createOne(data) {
  return request({
    url: '/question/QuestionType/save',
    method: 'post',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: '/question/QuestionType/delete/' + id,
    method: 'delete'
  })
}

export function updateOne(data) {
  return request({
    url: '/question/QuestionType/update/',
    method: 'put',
    data
  })
}

export function activeOne(data) {
  return request({
    url: '/question/QuestionType/active/' + data.id + '/' + data.active,
    method: 'put'
  })
}

