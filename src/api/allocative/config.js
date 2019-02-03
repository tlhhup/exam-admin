import request from '@/utils/request'

export function findProperties(project, profile, label) {
  return request({
    url: '/xhr/property/persistent?project=' + project + '&profile=' + profile + '&label=' + label,
    method: 'get'
  })
}

export function fetchFromConfigServer(project, profile, label) {
  return request({
    url: '/xhr/property/configServer?project=' + project + '&profile=' + profile + '&label=' + label,
    method: 'get'
  })
}

export function saveProperties(project, profile, label, data) {
  return request({
    url: '/xhr/property/persistent?project=' + project + '&profile=' + profile + '&label=' + label,
    method: 'post',
    data
  })
}

export function encryptProperty(envId, data) {
  return request({
    url: '/xhr/property/encrypt?envId=' + envId,
    method: 'post',
    data
  })
}

export function decryptProperty(envId, data) {
  return request({
    url: '/xhr/property/decrypt?envId=' + envId,
    method: 'post',
    data
  })
}
