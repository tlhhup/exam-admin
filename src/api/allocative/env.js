import request from '@/utils/request'

export function findAllEnv() {
  return request({
    url: '/xhr/env',
    method: 'get'
  })
}

export function findEnvDetail(id) {
  return request({
    url: '/xhr/detail',
    method: 'get',
    id
  })
}

export function createEnv(data) {
  return request({
    url: '/xhr/env',
    method: 'post',
    data
  })
}

export function deleteEnv(id) {
  return request({
    url: '/xhr/env?id=' + id,
    method: 'delete'
  })
}

export function updateEnv(data) {
  return request({
    url: '/xhr/env',
    method: 'put',
    data
  })
}
