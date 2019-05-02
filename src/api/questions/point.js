import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/question/KnowledgePoint/list',
    method: 'get',
    params: query
  })
}

export function fetchOne(id) {
  return request({
    url: '/question/KnowledgePoint/detail/' + id,
    method: 'get'
  })
}

export function createOne(data) {
  return request({
    url: '/question/KnowledgePoint/save',
    method: 'post',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: '/question/KnowledgePoint/delete/' + id,
    method: 'delete'
  })
}

export function updateOne(data) {
  return request({
    url: '/question/KnowledgePoint/update/',
    method: 'put',
    data
  })
}

export function activeOne(data) {
  return request({
    url: '/question/KnowledgePoint/active/' + data.id + '/' + data.active,
    method: 'put'
  })
}

