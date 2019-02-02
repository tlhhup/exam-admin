import request from '@/utils/request'

export function findProperties(project, profile, label) {
  return request({
    url: '/xhr/property/persistent?project=' + project + '&profile=' + profile + '&label=' + label,
    method: 'get'
  })
}
