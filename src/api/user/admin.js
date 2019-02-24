import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/admin/list',
    method: 'get',
    params: query
  })
}

export function createOne(data) {
  return request({
    url: '/user/admin/create',
    method: 'post',
    data
  })
}

export function deleteOne(id) {
  return request({
    url: '/user/admin/delete/' + id,
    method: 'delete'
  })
}

export function updateOne(data) {
  return request({
    url: '/user/admin/modify/' + data.id,
    method: 'put',
    data
  })
}

export function activeOne(data) {
  return request({
    url: '/user/admin/modify/' + data.id + '/active/' + data.active,
    method: 'put'
  })
}
