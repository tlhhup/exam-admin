import request from '@/utils/request'

export function findEnvParams(id) {
  return request({
    url: '/xhr/envParam?envId=' + id,
    method: 'get'
  })
}

export function addEnvParam(id, data) {
  return request({
    url: '/xhr/envParam?envId=' + id,
    method: 'post',
    data
  })
}

export function updateEnvParam(data) {
  return request({
    url: '/xhr/envParam',
    method: 'put',
    data
  })
}

export function deleteEnvParam(id) {
  return request({
    url: '/xhr/envParam?id=' + id,
    method: 'delete'
  })
}

export function createBatch(id, data) {
  return request({
    url: '/xhr/envParam/batch?envId=' + id,
    method: 'post',
    data
  })
}

export function deleteBatch(data) {
  return request({
    url: '/xhr/envParam/batch',
    method: 'delete',
    data
  })
}
