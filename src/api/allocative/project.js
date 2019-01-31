import request from '@/utils/request'

export function findList() {
  return request({
    url: '/xhr/project',
    method: 'get'
  })
}

export function findProjectDetail(id) {
  return request({
    url: '/xhr/project?id=' + id,
    method: 'get'
  })
}

export function createProject(data) {
  return request({
    url: '/xhr/project',
    method: 'post',
    data
  })
}

export function deleteProject(id) {
  return request({
    url: '/xhr/project?id=' + id,
    method: 'delete'
  })
}

export function updateProject(data) {
  return request({
    url: '/xhr/project',
    method: 'put',
    data
  })
}

export function addProjectLabel(id, label) {
  return request({
    url: '/xhr/project/label?projectId=' + id + '&labelName=' + label,
    method: 'post'
  })
}

export function deleteProjectLabel(id) {
  return request({
    url: '/xhr/project/label?labelId=' + id,
    method: 'delete'
  })
}

export function addProjectEnv(data) {
  return request({
    url: '/xhr/project/env',
    method: 'put',
    data
  })
}

export function deleteProjectEnv(projectId, envId) {
  return request({
    url: '/xhr/project/env?projectId=' + projectId + '&envId=?' + envId,
    method: 'delete'
  })
}

