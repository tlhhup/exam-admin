import request from '@/utils/request'

export function fetchDbList() {
  return request({
    url: '/generator/code/dbs',
    method: 'get'
  })
}

export function fetchTableList(query) {
  return request({
    url: '/generator/code/tables',
    method: 'get',
    params: query
  })
}

export function generate(data) {
  return request({
    url: '/generator/code',
    method: 'post',
    data
  })
}
