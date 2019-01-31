import request from '@/utils/request'

export function findList() {
  return request({
    url: '/xhr/encryptKey',
    method: 'get'
  })
}

export function createEncryptKey(data) {
  return request({
    url: '/xhr/encryptKey',
    method: 'post',
    data
  })
}

export function deleteEncryptKey(id) {
  return request({
    url: '/xhr/encryptKey?id=' + id,
    method: 'delete'
  })
}

export function updateEncryptKey(data) {
  return request({
    url: '/xhr/encryptKey',
    method: 'put',
    data
  })
}

export function createBatch(data) {
  return request({
    url: '/xhr/encryptKey/batch',
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

